import { db } from '../src/index.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// Placeholder for the junction table (Many-to-Many: Rombel <-> Student)
// You should ideally move this to your schema folder
export const rombelStudents = sqliteTable('rombel_students', {
	rombelId: integer('rombel_id')
		.notNull()
		.references(() => rombel.id),
	studentId: integer('student_id')
		.notNull()
		.references(() => studentTable.id)
}, (t) => ({
	pk: primaryKey(t.rombelId, t.studentId),
}));


/**
 * Inserts a new Rombel (Class Group) into the database.
 * This function is designed to be synchronous for better-sqlite3 transactions.
 * @param {Object} data - The rombel data.
 * @param {import('drizzle-orm/better-sqlite3').BetterSQLite3Transaction} tx - The transaction object.
 * @returns {number} The ID of the newly created rombel.
 */
const insertRombel = (data, tx) => {
	// 1. Validate minimal required fields
	if (!data.name || !data.class_id || !data.academic_year_id) {
		throw new Error('Missing required fields: name, class_id, or academic_year_id');
	}

	// 2. Generate code if not provided
	const code = data.code || `${data.name.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;

	// 3. Insert into table rombel
	const [newRombel] = tx
		.insert(rombel)
		.values({
			code: code,
			name: data.name,
			classId: data.class_id,
			academicYearId: data.academic_year_id,
			classAdvisorId: data.class_advisor_id,
			classroom: data.classroom,
			studentCapacity: data.student_capacity || 30 // Ensure student_capacity is passed
		})
		.returning({ id: rombel.id })
		.all(); // .all() is used for better-sqlite3 to execute and get results

	return newRombel.id;
};

/**
 * Registers a list of students to a specific Rombel.
 * This function is designed to be synchronous for better-sqlite3 transactions.
 * @param {number} rombelId - The ID of the rombel.
 * @param {number[]} siswaIds - Array of student IDs to register.
 * @param {import('drizzle-orm/better-sqlite3').BetterSQLite3Transaction} tx - The transaction object.
 * @returns {boolean} True if successful.
 */
const registerSiswaToRombel = (rombelId, siswaIds, tx) => {
	if (!rombelId) throw new Error('Rombel ID is required');
	if (!Array.isArray(siswaIds) || siswaIds.length === 0) return false;

	const valuesToInsert = siswaIds.map((studentId) => ({
		rombelId: rombelId,
		studentId: studentId
	}));

	tx.insert(rombelStudents).values(valuesToInsert).run(); // .run() is used for better-sqlite3 to execute without returning data
	return true;
};

/**
 * Main service function to handle the full registration of a Rombel and its students.
 * @param {Object[]} payloadList - Array of rombel data objects from the frontend.
 * @returns {Object} Result status.
 */
export const registerRombel = (payloadList) => {
	try {
		db.transaction((tx) => {
			for (const rombelData of payloadList) {
				// Frontend payload has 'siswa' as an array of IDs
				const studentCount = rombelData.siswa ? rombelData.siswa.length : 0;
				const capacity = rombelData.student_capacity || 30; // Get capacity from payload or default to 30

				// Backend Validation: Check student capacity
				if (studentCount > capacity) {
					throw new Error(`Jumlah siswa (${studentCount}) melebihi kapasitas rombel (${capacity}).`);
				}
				if (capacity <= 0) {
					throw new Error('Kapasitas siswa harus lebih dari 0.');
				}

				// 1. INSERT ROMBEL
				const rombelId = insertRombel(
					{
						name: rombelData.nama_rombel,
						class_id: parseInt(rombelData.tingkat_kelas),
						academic_year_id: 1, // TODO: Resolve '2025/2026 Genap' to an ID
						class_advisor_id: parseInt(rombelData.wali_kelas),
						classroom: rombelData.nama_ruangan,
						student_capacity: capacity // Pass capacity to insertRombel
					},
					tx
				);

				// 2. INSERT SISWA KE ROMBEL
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
