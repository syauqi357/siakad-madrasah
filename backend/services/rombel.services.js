import { db, rombelStudents, studentTable } from '../src/index.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { academicYear } from '../src/db/schema/academicYear.js';
import { curriculum } from '../src/db/schema/curriculum.js';
import { studentHistory } from '../src/db/schema/studentHistory.js';
import { studentAttendance } from '../src/db/schema/studentAttendance.js';
import { and, eq, inArray, isNull, sql } from 'drizzle-orm';

/**
 * Get the active academic year ID, or create one if none exists
 */
const getActiveAcademicYearId = () => {
	// Try to find active academic year
	const active = db
		.select({ id: academicYear.id })
		.from(academicYear)
		.where(eq(academicYear.isActive, 1))
		.get();

	if (active) {
		return active.id;
	}

	// If no active year, get the first one
	const first = db.select({ id: academicYear.id }).from(academicYear).limit(1).get();

	if (first) {
		return first.id;
	}

	// If no academic year exists at all, create a default one
	const currentYear = new Date().getFullYear();
	const [newYear] = db
		.insert(academicYear)
		.values({
			name: `${currentYear}/${currentYear + 1}`,
			startYear: currentYear,
			endYear: currentYear + 1,
			isActive: 1
		})
		.returning({ id: academicYear.id })
		.all();

	return newYear.id;
};

// ... (insertRombel and registerSiswaToRombel functions remain the same) ...
const insertRombel = (data, tx) => {
	if (!data.name || !data.class_id || !data.academic_year_id) {
		throw new Error('Missing required fields: name, class_id, or academic_year_id');
	}
	const code = data.code || `${data.name.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;
	const [newRombel] = tx
		.insert(rombel)
		.values({
			code: code,
			name: data.name,
			classId: data.class_id,
			academicYearId: data.academic_year_id,
			classAdvisorId: data.class_advisor_id,
			classroom: data.classroom,
			studentCapacity: data.student_capacity || 30,
			kurikulum: data.kurikulum || null
		})
		.returning({ id: rombel.id })
		.all();
	return newRombel.id;
};

const registerSiswaToRombel = (rombelId, siswaIds, tx) => {
	if (!rombelId) throw new Error('Rombel ID is required');
	if (!Array.isArray(siswaIds) || siswaIds.length === 0) return false;
	const valuesToInsert = siswaIds.map((studentId) => ({
		rombelId: rombelId,
		studentId: studentId
	}));
	// 1. Insert into Junction Table (existing logic)
	tx.insert(rombelStudents).values(valuesToInsert).run();

	// 2. Update Student Table (Foreign Key Sync)
	// We use `inArray` to update all students at once
	tx.update(studentTable)
		.set({ rombelId: rombelId })
		.where(inArray(studentTable.id, siswaIds))
		.run();

	return true;
};

export const registerRombel = (payloadList) => {
	// Validate payload before transaction
	for (const rombelData of payloadList) {
		const studentCount = rombelData.siswa ? rombelData.siswa.length : 0;
		const capacity = rombelData.student_capacity || 30;
		if (studentCount > capacity) {
			return { error: 'CAPACITY_EXCEEDED', studentCount, capacity };
		}
		if (capacity <= 0) {
			return { error: 'INVALID_CAPACITY' };
		}
	}

	// Get active academic year before transaction
	const academicYearId = getActiveAcademicYearId();

	db.transaction((tx) => {
		for (const rombelData of payloadList) {
			const rombelId = insertRombel(
				{
					name: rombelData.nama_rombel,
					class_id: parseInt(rombelData.tingkat_kelas),
					academic_year_id: academicYearId,
					class_advisor_id: parseInt(rombelData.wali_kelas),
					classroom: rombelData.nama_ruangan,
					student_capacity: rombelData.student_capacity || 30,
					kurikulum: rombelData.kurikulum || null
				},
				tx
			);
			if (rombelData.siswa && rombelData.siswa.length > 0) {
				registerSiswaToRombel(rombelId, rombelData.siswa, tx);
			}
		}
	});
	return { success: true };
};

/**
 * Fetches all rombels with their details (teacher name, class level, student count).
 */
export const getAllRombels = () => {
	// We need to join rombel with classes and teachers, and count students
	// Since Drizzle's query builder for complex joins + aggregates can be verbose,
	// we'll use a raw SQL-like approach or multiple queries if needed,
	// but Drizzle supports this via .leftJoin and .groupBy.

	// However, counting relations in the same query with Drizzle + SQLite can be tricky.
	// Let's fetch the rombels first, then we can count students or use a subquery.

	// Simplified approach: Fetch rombel + class + teacher
	const rombels = db
		.select({
			id: rombel.id,
			namaRombel: rombel.name,
			tingkat: classes.className,
			waliKelas: teachers.fullName,
			ruangan: rombel.classroom,
			kapasitas: rombel.studentCapacity,
			kurikulum: sql`COALESCE((SELECT c.name FROM curriculum c WHERE c.id = CAST(${rombel.kurikulum} AS INTEGER)), ${rombel.kurikulum})`.as('kurikulum')
		})
		.from(rombel)
		.leftJoin(classes, eq(rombel.classId, classes.id))
		.leftJoin(teachers, eq(rombel.classAdvisorId, teachers.id))
		.all();

	// Now fetch student counts for each rombel (only active members)

	return rombels.map((r) => {
		const studentCount = db
			.select({ count: sql`count(*)` })
			.from(rombelStudents)
			.where(and(eq(rombelStudents.rombelId, r.id), eq(rombelStudents.isActive, true)))
			.get();

		return {
			...r,
			totalSiswa: studentCount ? studentCount.count : 0
		};
	});
};

/**
 * Fetches a single rombel by ID with its details and students list.
 * @param {number} rombelId - The ID of the rombel to fetch
 */
export const getRombelById = (rombelId) => {
	// Fetch rombel with class and teacher info
	const rombelData = db
		.select({
			id: rombel.id,
			code: rombel.code,
			namaRombel: rombel.name,
			tingkat: classes.className,
			tingkatId: rombel.classId,
			waliKelas: teachers.fullName,
			waliKelasId: rombel.classAdvisorId,
			ruangan: rombel.classroom,
			kapasitas: rombel.studentCapacity,
			kurikulum: sql`COALESCE((SELECT c.name FROM curriculum c WHERE c.id = CAST(${rombel.kurikulum} AS INTEGER)), ${rombel.kurikulum})`.as('kurikulum')
		})
		.from(rombel)
		.leftJoin(classes, eq(rombel.classId, classes.id))
		.leftJoin(teachers, eq(rombel.classAdvisorId, teachers.id))
		.where(eq(rombel.id, rombelId))
		.get();

	if (!rombelData) {
		return null;
	}

	// Fetch only ACTIVE students in this rombel (isActive = true means currently in this rombel)
	const students = db
		.select({
			id: studentTable.id,
			name: studentTable.studentName,
			nisn: studentTable.nisn,
			gender: studentTable.gender,
			status: studentTable.status,
			isActive: rombelStudents.isActive
		})
		.from(rombelStudents)
		.innerJoin(studentTable, eq(rombelStudents.studentId, studentTable.id))
		.where(and(eq(rombelStudents.rombelId, rombelId), eq(rombelStudents.isActive, true)))
		.all();

	// Count active students (status = ACTIVE, not MUTASI/GRADUATE)
	const activeCount = students.filter((s) => s.status === 'ACTIVE').length;

	return {
		...rombelData,
		totalSiswa: activeCount,
		students: students
	};
};

/**
 * Adds students to an existing rombel.
 * @param {number} rombelId - The ID of the rombel
 * @param {number[]} studentIds - Array of student IDs to add
 */
export const addStudentsToRombel = (rombelId, studentIds) => {
	const rombelData = getRombelById(rombelId);
	if (!rombelData) return null;

	const currentCount = rombelData.students.filter((s) => s.status === 'ACTIVE').length;
	const available = rombelData.kapasitas - currentCount;

	if (studentIds.length > available) {
		return { error: 'CAPACITY_EXCEEDED', available, requested: studentIds.length };
	}

	db.transaction((tx) => {
		registerSiswaToRombel(rombelId, studentIds, tx);
	});

	return { success: true, added: studentIds.length };
};

/**
 * Deletes a rombel and cleans up related student assignments.
 * @param {number} rombelId - The ID of the rombel to delete
 */
export const deleteRombelById = (rombelId) => {
	const existing = db.select({ id: rombel.id }).from(rombel).where(eq(rombel.id, rombelId)).get();
	if (!existing) return null;

	db.transaction((tx) => {
		// Clear rombelId on students that reference this rombel
		tx.update(studentTable)
			.set({ rombelId: null })
			.where(eq(studentTable.rombelId, rombelId))
			.run();

		// Delete attendance records for this rombel (rombelId is NOT NULL, can't nullify)
		tx.delete(studentAttendance).where(eq(studentAttendance.rombelId, rombelId)).run();

		// Nullify rombelId in student history (keeps history but removes rombel reference)
		tx.update(studentHistory)
			.set({ rombelId: null })
			.where(eq(studentHistory.rombelId, rombelId))
			.run();

		// Delete junction table entries
		tx.delete(rombelStudents).where(eq(rombelStudents.rombelId, rombelId)).run();

		// Delete the rombel itself
		tx.delete(rombel).where(eq(rombel.id, rombelId)).run();
	});

	return { success: true };
};
