import { db } from '../src/index.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { studentTable, rombelStudents } from '../src/index.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { academicYear } from '../src/db/schema/academicYear.js';
// import {  } from '../src/index.js';
import { eq, and, sql, ne } from 'drizzle-orm';

/**
 * Get all class levels ordered by grade
 * Returns classes with their order (X=1, XI=2, XII=3, etc.)
 */

export const getClassLevels = () => {
	const classLevels = db
		.select({
			id: classes.id,
			className: classes.className
		})
		.from(classes)
		.all();

	// Sort by Roman numeral order
	const romanOrder = { X: 1, XI: 2, XII: 3, VII: 1, VIII: 2, IX: 3 };
	return classLevels.sort((a, b) => {
		const orderA = romanOrder[a.className] || parseInt(a.className) || 99;
		const orderB = romanOrder[b.className] || parseInt(b.className) || 99;
		return orderA - orderB;
	});
};

/**
 * Check if a class level is the final grade (XII or IX)
 */
export const isFinalGrade = (className) => {
	const finalGrades = ['XII', 'IX', '12', '9', '6', '3', 'VI', 'III'];
	return finalGrades.includes(className);
};

/**
 * Get rombels with ACTIVE students for promotion
 * Groups by class level for easy selection
 */
export const getRombelsForPromotion = (academicYearId = null) => {
	// Get active academic year if not provided
	let yearId = academicYearId;
	if (!yearId) {
		const activeYear = db
			.select({ id: academicYear.id })
			.from(academicYear)
			.where(eq(academicYear.isActive, 1))
			.get();
		yearId = activeYear?.id;
	}

	if (!yearId) {
		return [];
	}

	// Get rombels with student counts
	const rombels = db
		.select({
			id: rombel.id,
			code: rombel.code,
			name: rombel.name,
			classId: rombel.classId,
			className: classes.className,
			academicYearId: rombel.academicYearId
		})
		.from(rombel)
		.innerJoin(classes, eq(rombel.classId, classes.id))
		.where(eq(rombel.academicYearId, yearId))
		.all();

	// Count active students per rombel
	return rombels.map((r) => {
		const activeCount = db
			.select({ count: sql`count(*)` })
			.from(rombelStudents)
			.innerJoin(studentTable, eq(rombelStudents.studentId, studentTable.id))
			.where(
				and(
					eq(rombelStudents.rombelId, r.id),
					eq(rombelStudents.isActive, true),
					eq(studentTable.status, 'ACTIVE')
				)
			)
			.get();

		return {
			...r,
			activeStudentCount: activeCount?.count || 0,
			isFinalGrade: isFinalGrade(r.className)
		};
	});
};

/**
 * Get active students from a rombel for promotion
 */
export const getStudentsForPromotion = (rombelId) => {
	const students = db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			status: studentTable.status
		})
		.from(rombelStudents)
		.innerJoin(studentTable, eq(rombelStudents.studentId, studentTable.id))
		.where(
			and(
				eq(rombelStudents.rombelId, rombelId),
				eq(rombelStudents.isActive, true),
				eq(studentTable.status, 'ACTIVE')
			)
		)
		.all();

	return students;
};

/**
 * Get target rombels for promotion (next academic year, next class level)
 */
export const getTargetRombels = (sourceClassId) => {
	// Get source class info
	const sourceClass = db
		.select({ id: classes.id, className: classes.className })
		.from(classes)
		.where(eq(classes.id, sourceClassId))
		.get();

	if (!sourceClass) return [];

	// Determine next class level
	const classLevels = getClassLevels();
	const currentIndex = classLevels.findIndex((c) => c.id === sourceClassId);
	const nextClass = classLevels[currentIndex + 1];

	if (!nextClass) {
		// This is final grade, no promotion target
		return [];
	}

	// Get active academic year
	const activeYear = db
		.select({ id: academicYear.id, name: academicYear.name })
		.from(academicYear)
		.where(eq(academicYear.isActive, 1))
		.get();

	if (!activeYear) return [];

	// Get rombels in next class level for active year
	const targetRombels = db
		.select({
			id: rombel.id,
			code: rombel.code,
			name: rombel.name,
			classId: rombel.classId,
			className: classes.className,
			capacity: rombel.studentCapacity
		})
		.from(rombel)
		.innerJoin(classes, eq(rombel.classId, classes.id))
		.where(and(eq(rombel.classId, nextClass.id), eq(rombel.academicYearId, activeYear.id)))
		.all();

	// Get current student count for each target rombel
	return targetRombels.map((r) => {
		const currentCount = db
			.select({ count: sql`count(*)` })
			.from(rombelStudents)
			.where(and(eq(rombelStudents.rombelId, r.id), eq(rombelStudents.isActive, true)))
			.get();

		return {
			...r,
			currentCount: currentCount?.count || 0,
			availableSlots: r.capacity - (currentCount?.count || 0)
		};
	});
};

/**
 * Promote students to new rombel (TRANSACTIONAL)
 * @param {number[]} studentIds - Array of student IDs to promote
 * @param {number} targetRombelId - Target rombel ID
 * @returns {object} Result with success/failed counts
 */
export const promoteStudents = (studentIds, targetRombelId) => {
	// Validate target rombel exists
	const targetRombelData = db
		.select({
			id: rombel.id,
			name: rombel.name,
			capacity: rombel.studentCapacity
		})
		.from(rombel)
		.where(eq(rombel.id, targetRombelId))
		.get();

	if (!targetRombelData) return { error: 'TARGET_NOT_FOUND' };

	// Check capacity
	const currentCount = db
		.select({ count: sql`count(*)` })
		.from(rombelStudents)
		.where(and(eq(rombelStudents.rombelId, targetRombelId), eq(rombelStudents.isActive, true)))
		.get();

	const availableSlots = targetRombelData.capacity - (currentCount?.count || 0);
	if (studentIds.length > availableSlots) {
		return { error: 'CAPACITY_EXCEEDED', available: availableSlots, requested: studentIds.length };
	}

	const results = {
		success: [],
		failed: [],
		totalProcessed: studentIds.length
	};

	db.transaction((tx) => {
		const now = new Date().toISOString();

		for (const studentId of studentIds) {
			try {
				// 1. Validate student is ACTIVE
				const student = tx
					.select({
						id: studentTable.id,
						name: studentTable.studentName,
						status: studentTable.status
					})
					.from(studentTable)
					.where(eq(studentTable.id, studentId))
					.get();

				if (!student) {
					results.failed.push({ studentId, reason: 'Siswa tidak ditemukan' });
					continue;
				}

				if (student.status !== 'ACTIVE') {
					results.failed.push({ studentId, name: student.name, reason: 'Siswa tidak aktif' });
					continue;
				}

				// 2. Deactivate current rombel assignment
				tx.update(rombelStudents)
					.set({ isActive: false, leftAt: now })
					.where(and(eq(rombelStudents.studentId, studentId), eq(rombelStudents.isActive, true)))
					.run();

				// 3. Create new rombel assignment
				tx.insert(rombelStudents)
					.values({
						rombelId: targetRombelId,
						studentId: studentId,
						isActive: true
					})
					.run();

				// 4. Update student's rombelId reference
				tx.update(studentTable)
					.set({ rombelId: targetRombelId })
					.where(eq(studentTable.id, studentId))
					.run();

				results.success.push({ studentId, name: student.name });
			} catch (err) {
				results.failed.push({ studentId, reason: err.message });
			}
		}
	});

	return {
		...results,
		successCount: results.success.length,
		failedCount: results.failed.length
	};
};

/**
 * Get academic years for filter
 */
export const getAcademicYears = () => {
	return db
		.select({
			id: academicYear.id,
			name: academicYear.name,
			isActive: academicYear.isActive
		})
		.from(academicYear)
		.orderBy(sql`${academicYear.startYear} DESC`)
		.all();
};
