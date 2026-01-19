import { db } from '../app.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
// We need a junction table for rombel <-> student.
// Since it wasn't provided in the context, I'll assume one needs to be defined or imported.
// For now, I will define a placeholder schema for the junction table here to make the code valid.
import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// Placeholder for the junction table (Many-to-Many: Rombel <-> Student)
// You should ideally move this to your schema folder
export const rombelStudents = sqliteTable(
	'rombel_students',
	{
		rombelId: integer('rombel_id')
			.notNull()
			.references(() => rombel.id),
		studentId: integer('student_id')
			.notNull()
			.references(() => studentTable.id)
	},
	(t) => ({
		pk: primaryKey(t.rombelId, t.studentId)
	})
);

/**
 * Inserts a new Rombel (Class Group) into the database.
 * @param {Object} data - The rombel data.
 * @returns {Promise<number>} The ID of the newly created rombel.
 */
const insertRombel = async (data) => {
	// 1. Validate minimal required fields
	if (!data.name || !data.class_id || !data.academic_year_id) {
		throw new Error('Missing required fields: name, class_id, or academic_year_id');
	}

	// 2. Generate code if not provided
	const code = data.code || `${data.name.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;

	// 3. Insert into table rombel
	// Note: 'curriculum' and 'type' are in your payload but NOT in the 'rombel' schema you provided.
	// I am omitting them here to prevent SQL errors. You must add them to 'backend/src/db/schema/classGroup.js' if you want to save them.
	const [newRombel] = await db
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
		.returning({ id: rombel.id });

	return newRombel.id;
};

/**
 * Registers a list of students to a specific Rombel.
 * @param {number} rombelId - The ID of the rombel.
 * @param {number[]} siswaIds - Array of student IDs to register.
 * @returns {Promise<boolean>} True if successful.
 */
const registerSiswaToRombel = async (rombelId, siswaIds) => {
	if (!rombelId) throw new Error('Rombel ID is required');
	if (!Array.isArray(siswaIds) || siswaIds.length === 0) return false;

	const valuesToInsert = siswaIds.map((studentId) => ({
		rombelId: rombelId,
		studentId: studentId
	}));

	await db.insert(rombelStudents).values(valuesToInsert);
	return true;
};

/**
 * Main service function to handle the full registration of a Rombel and its students.
 * @param {Object[]} payloadList - Array of rombel data objects from the frontend.
 * @returns {Promise<Object>} Result status.
 */
export const registerRombel = async (payloadList) => {
	try {
		await db.transaction(async (tx) => {
			for (const rombelData of payloadList) {
				// 1. INSERT ROMBEL
				const rombelId = await insertRombel({
					name: rombelData.nama_rombel,
					class_id: parseInt(rombelData.tingkat_kelas),
					academic_year_id: 1, // TODO: Resolve '2025/2026 Genap' to an ID
					class_advisor_id: parseInt(rombelData.wali_kelas),
					classroom: rombelData.nama_ruangan
					// curriculum: rombelData.kurikulum, // Ignored: Not in schema
					// type: rombelData.jenis_rombel // Ignored: Not in schema
				});

				// 2. INSERT SISWA KE ROMBEL
				// The payload now sends an array of IDs: [1, 2, 3, 4, 5]
				if (rombelData.siswa && rombelData.siswa.length > 0) {
					await registerSiswaToRombel(rombelId, rombelData.siswa);
				}
			}
		});

		return { success: true, message: 'Rombel registered successfully' };
	} catch (error) {
		console.error('Error registering rombel:', error);
		throw new Error('Failed to register rombel: ' + error.message);
	}
};
