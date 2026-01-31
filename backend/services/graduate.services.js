import { db } from '../src/index.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { studentHistory } from '../src/db/schema/studentHistory.js';
import { rombelStudents } from '../src/db/schema/rombelStudents.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { eq, and, count, sql, desc } from 'drizzle-orm';

/**
 * Get all graduated students (alumni) with pagination and optional year filter
 * @param {Object} options - { page, limit, year }
 */
export const getGraduatedStudents = async ({ page = 1, limit = 10, year = null } = {}) => {
	const offset = (page - 1) * limit;

	let query = db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			birthPlace: studentTable.birthPlace,
			birthDate: studentTable.birthDate,
			status: studentTable.status,
			// History data
			historyId: studentHistory.id,
			scores: studentHistory.scores,
			completionDate: studentHistory.completionDate,
			graduationYear: studentHistory.graduationYear,
			certificateNumber: studentHistory.certificateNumber,
			finalGrade: studentHistory.finalGrade,
			// Last class info
			lastRombelId: rombel.id,
			lastClassName: rombel.name,
			lastClassCode: rombel.code
		})
		.from(studentTable)
		.innerJoin(
			studentHistory,
			and(eq(studentTable.id, studentHistory.studentId), eq(studentHistory.statusType, 'GRADUATE'))
		)
		.leftJoin(rombel, eq(studentHistory.rombelId, rombel.id))
		.where(eq(studentTable.status, 'GRADUATE'))
		.orderBy(desc(studentHistory.completionDate));

	// Apply year filter if provided
	if (year) {
		query = query.where(
			and(eq(studentTable.status, 'GRADUATE'), eq(studentHistory.graduationYear, year))
		);
	}

	const data = await query.limit(limit).offset(offset);

	return data;
};

/**
 * Get single graduate/alumni by student ID
 * @param {number} studentId
 */
export const getGraduateById = async (studentId) => {
	const result = await db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			localNis: studentTable.localNis,
			name: studentTable.studentName,
			gender: studentTable.gender,
			birthPlace: studentTable.birthPlace,
			birthDate: studentTable.birthDate,
			religion: studentTable.religion,
			status: studentTable.status,
			// History data
			historyId: studentHistory.id,
			scores: studentHistory.scores,
			completionDate: studentHistory.completionDate,
			graduationYear: studentHistory.graduationYear,
			certificateNumber: studentHistory.certificateNumber,
			finalGrade: studentHistory.finalGrade,
			reason: studentHistory.reason,
			// Last class info
			lastRombelId: rombel.id,
			lastClassName: rombel.name,
			lastClassCode: rombel.code,
			lastClassLevel: classes.className
		})
		.from(studentTable)
		.innerJoin(
			studentHistory,
			and(eq(studentTable.id, studentHistory.studentId), eq(studentHistory.statusType, 'GRADUATE'))
		)
		.leftJoin(rombel, eq(studentHistory.rombelId, rombel.id))
		.leftJoin(classes, eq(rombel.classId, classes.id))
		.where(and(eq(studentTable.id, studentId), eq(studentTable.status, 'GRADUATE')))
		.get();

	return result || null;
};

/**
 * Count total graduates
 */
export const countGraduates = async () => {
	const [result] = await db
		.select({ count: count() })
		.from(studentTable)
		.where(eq(studentTable.status, 'GRADUATE'));

	return result?.count || 0;
};

/**
 * Count graduates grouped by year
 * Returns: [{ year: '2024/2025', count: 45 }, ...]
 */
export const countGraduatesByYear = async () => {
	const result = await db
		.select({
			year: studentHistory.graduationYear,
			count: count()
		})
		.from(studentHistory)
		.where(eq(studentHistory.statusType, 'GRADUATE'))
		.groupBy(studentHistory.graduationYear)
		.orderBy(desc(studentHistory.graduationYear));

	return result;
};

/**
 * Get distinct graduation years for filter dropdown
 */
export const getGraduationYears = async () => {
	const result = await db
		.selectDistinct({ year: studentHistory.graduationYear })
		.from(studentHistory)
		.where(
			and(
				eq(studentHistory.statusType, 'GRADUATE'),
				sql`${studentHistory.graduationYear} IS NOT NULL`
			)
		)
		.orderBy(desc(studentHistory.graduationYear));

	return result.map((r) => r.year).filter(Boolean);
};

/**
 * Graduate a student (transition from ACTIVE to GRADUATE)
 * @param {number} studentId
 * @param {Object} data - { completionDate, graduationYear, certificateNumber, finalGrade, scores }
 */
export const graduateStudent = async (studentId, data) => {
	// Validate required fields
	if (!data.completionDate) {
		throw new Error('Tanggal kelulusan wajib diisi');
	}
	if (!data.graduationYear) {
		throw new Error('Tahun kelulusan wajib diisi');
	}

	// Get current student
	const student = await db.select().from(studentTable).where(eq(studentTable.id, studentId)).get();

	if (!student) {
		throw new Error('Siswa tidak ditemukan');
	}

	if (student.status !== 'ACTIVE') {
		throw new Error('Hanya siswa ACTIVE yang dapat diluluskan');
	}

	// Get current active rombel assignment
	const activeRombel = await db
		.select({
			rombelId: rombelStudents.rombelId,
			rombelName: rombel.name
		})
		.from(rombelStudents)
		.leftJoin(rombel, eq(rombelStudents.rombelId, rombel.id))
		.where(and(eq(rombelStudents.studentId, studentId), eq(rombelStudents.isActive, true)))
		.get();

	const now = new Date().toISOString();

	// Execute transaction
	return db.transaction((tx) => {
		// 1. Update student status to GRADUATE
		tx.update(studentTable)
			.set({
				status: 'GRADUATE',
				updatedAt: now
			})
			.where(eq(studentTable.id, studentId))
			.run();

		// 2. Deactivate rombel assignment if exists
		if (activeRombel) {
			tx.update(rombelStudents)
				.set({
					isActive: false,
					leftAt: now
				})
				.where(
					and(
						eq(rombelStudents.studentId, studentId),
						eq(rombelStudents.rombelId, activeRombel.rombelId)
					)
				)
				.run();
		}

		// 3. Create history record with graduation data
		const historyRecord = tx
			.insert(studentHistory)
			.values({
				studentId: studentId,
				rombelId: activeRombel ? activeRombel.rombelId : null,
				statusType: 'GRADUATE',
				scores: data.scores || null,
				completionDate: data.completionDate,
				graduationYear: data.graduationYear,
				certificateNumber: data.certificateNumber || null,
				finalGrade: data.finalGrade || null,
				reason: data.reason || null
			})
			.returning()
			.get();

		return {
			success: true,
			student: {
				id: studentId,
				name: student.studentName,
				status: 'GRADUATE'
			},
			history: historyRecord,
			lastClass: activeRombel?.rombelName || null
		};
	});
};

/**
 * Bulk graduate multiple students (for end of year graduation)
 * @param {Array} students - [{ studentId, certificateNumber, finalGrade, scores }]
 * @param {Object} commonData - { completionDate, graduationYear }
 */
export const bulkGraduateStudents = (students, commonData) => {
	if (!commonData.completionDate || !commonData.graduationYear) {
		throw new Error('Tanggal dan tahun kelulusan wajib diisi');
	}

	if (!Array.isArray(students) || students.length === 0) {
		throw new Error('Daftar siswa tidak boleh kosong');
	}

	const results = {
		success: [],
		failed: []
	};

	const now = new Date().toISOString();

	// Process each student in a single synchronous transaction
	db.transaction((tx) => {
		for (const studentData of students) {
			try {
				const { studentId, certificateNumber, finalGrade, scores } = studentData;

				// Get student (synchronous)
				const student = tx
					.select()
					.from(studentTable)
					.where(eq(studentTable.id, studentId))
					.get();

				if (!student) {
					results.failed.push({
						studentId,
						error: 'Siswa tidak ditemukan'
					});
					continue;
				}

				if (student.status !== 'ACTIVE') {
					results.failed.push({
						studentId,
						name: student.studentName,
						error: 'Siswa bukan berstatus ACTIVE'
					});
					continue;
				}

				// Get active rombel (synchronous)
				const activeRombel = tx
					.select({ rombelId: rombelStudents.rombelId })
					.from(rombelStudents)
					.where(and(eq(rombelStudents.studentId, studentId), eq(rombelStudents.isActive, true)))
					.get();

				// Update student status
				tx.update(studentTable)
					.set({ status: 'GRADUATE', updatedAt: now })
					.where(eq(studentTable.id, studentId))
					.run();

				// Deactivate rombel
				if (activeRombel) {
					tx.update(rombelStudents)
						.set({ isActive: false, leftAt: now })
						.where(
							and(
								eq(rombelStudents.studentId, studentId),
								eq(rombelStudents.rombelId, activeRombel.rombelId)
							)
						)
						.run();
				}

				// Create history
				tx.insert(studentHistory)
					.values({
						studentId,
						rombelId: activeRombel?.rombelId || null,
						statusType: 'GRADUATE',
						scores: scores || null,
						completionDate: commonData.completionDate,
						graduationYear: commonData.graduationYear,
						certificateNumber: certificateNumber || null,
						finalGrade: finalGrade || null
					})
					.run();

				results.success.push({
					studentId,
					name: student.studentName
				});
			} catch (error) {
				results.failed.push({
					studentId: studentData.studentId,
					error: error.message
				});
			}
		}
	});

	return {
		totalProcessed: students.length,
		successCount: results.success.length,
		failedCount: results.failed.length,
		success: results.success,
		failed: results.failed
	};
};

/**
 * Update graduate data (e.g., fix certificate number)
 * @param {number} studentId
 * @param {Object} data - fields to update
 */
export const updateGraduateData = async (studentId, data) => {
	// Verify student is graduated
	const student = await db.select().from(studentTable).where(eq(studentTable.id, studentId)).get();

	if (!student || student.status !== 'GRADUATE') {
		throw new Error('Siswa bukan alumni');
	}

	// Get history record
	const history = await db
		.select()
		.from(studentHistory)
		.where(and(eq(studentHistory.studentId, studentId), eq(studentHistory.statusType, 'GRADUATE')))
		.get();

	if (!history) {
		throw new Error('Data history tidak ditemukan');
	}

	// Update allowed fields only
	const updateData = {};
	if (data.certificateNumber !== undefined) updateData.certificateNumber = data.certificateNumber;
	if (data.finalGrade !== undefined) updateData.finalGrade = data.finalGrade;
	if (data.scores !== undefined) updateData.scores = data.scores;
	if (data.graduationYear !== undefined) updateData.graduationYear = data.graduationYear;
	if (data.completionDate !== undefined) updateData.completionDate = data.completionDate;

	if (Object.keys(updateData).length === 0) {
		throw new Error('Tidak ada data yang diupdate');
	}

	const updated = await db
		.update(studentHistory)
		.set(updateData)
		.where(eq(studentHistory.id, history.id))
		.returning();

	return updated[0];
};
