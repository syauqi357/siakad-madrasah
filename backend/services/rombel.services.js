import { db } from '../src/index.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { rombelStudents } from '../src/db/schema/rombelStudents.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { eq, sql } from 'drizzle-orm';

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
			studentCapacity: data.student_capacity || 30
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
	tx.insert(rombelStudents).values(valuesToInsert).run();
	return true;
};

export const registerRombel = (payloadList) => {
	try {
		db.transaction((tx) => {
			for (const rombelData of payloadList) {
				const studentCount = rombelData.siswa ? rombelData.siswa.length : 0;
				const capacity = rombelData.student_capacity || 30;
				if (studentCount > capacity) {
					throw new Error(
						`Jumlah siswa (${studentCount}) melebihi kapasitas rombel (${capacity}).`
					);
				}
				if (capacity <= 0) {
					throw new Error('Kapasitas siswa harus lebih dari 0.');
				}
				const rombelId = insertRombel(
					{
						name: rombelData.nama_rombel,
						class_id: parseInt(rombelData.tingkat_kelas),
						academic_year_id: 1,
						class_advisor_id: parseInt(rombelData.wali_kelas),
						classroom: rombelData.nama_ruangan,
						student_capacity: capacity
					},
					tx
				);
				if (rombelData.siswa && rombelData.siswa.length > 0) {
					registerSiswaToRombel(rombelId, rombelData.siswa, tx);
				}
			}
		});
		return { success: true, message: 'Rombel registered successfully' };
	} catch (error) {
		console.error('Error registering rombel:', error);
		throw new Error('Failed to register rombel: ' + error.message);
	}
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
			kapasitas: rombel.studentCapacity
			// We'll assume 'kurikulum' is not in DB yet or use a placeholder
			// kurikulum: ...
		})
		.from(rombel)
		.leftJoin(classes, eq(rombel.classId, classes.id))
		.leftJoin(teachers, eq(rombel.classAdvisorId, teachers.id))
		.all();

	// Now fetch student counts for each rombel
	// This is N+1 but safe for SQLite's speed for now, or we can optimize later
	const result = rombels.map((r) => {
		const studentCount = db
			.select({ count: sql`count(*)` })
			.from(rombelStudents)
			.where(eq(rombelStudents.rombelId, r.id))
			.get();

		return {
			...r,
			totalSiswa: studentCount ? studentCount.count : 0,
			kurikulum: 'Merdeka' // Placeholder as it's not in schema yet
		};
	});

	return result;
};
