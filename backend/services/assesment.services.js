import { db } from '../src/index.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { eq, count, desc } from 'drizzle-orm';

/*
 * ========================================================================
 * ASSESSMENT TYPE SERVICE
 * ========================================================================
 * Manages assessment types (Jenis Penilaian) such as:
 * - TUGAS (Tugas Harian)
 * - UH (Ulangan Harian)
 * - UTS (Ujian Tengah Semester)
 * - UAS (Ujian Akhir Semester)
 * - PRAKTIK (Penilaian Praktik)
 * - PROYEK (Penilaian Proyek)
 * ========================================================================
 */

/*
 * ------------------------------------------------------------------------
 * MOCKUP: GET ALL ASSESSMENT TYPES RESPONSE
 * ------------------------------------------------------------------------
 * GET /api/assessment-types
 *
 * Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "code": "TUGAS",
 *       "name": "Tugas Harian",
 *       "defaultWeight": 20,
 *       "isActive": true,
 *       "createdAt": "2025-01-15T10:00:00.000Z",
 *       "usageCount": 150  // jumlah nilai yang pakai tipe ini
 *     },
 *     {
 *       "id": 2,
 *       "code": "UH",
 *       "name": "Ulangan Harian",
 *       "defaultWeight": 25,
 *       "isActive": true,
 *       "createdAt": "2025-01-15T10:00:00.000Z",
 *       "usageCount": 200
 *     },
 *     {
 *       "id": 3,
 *       "code": "UTS",
 *       "name": "Ujian Tengah Semester",
 *       "defaultWeight": 25,
 *       "isActive": true,
 *       "createdAt": "2025-01-15T10:00:00.000Z",
 *       "usageCount": 100
 *     },
 *     {
 *       "id": 4,
 *       "code": "UAS",
 *       "name": "Ujian Akhir Semester",
 *       "defaultWeight": 30,
 *       "isActive": true,
 *       "createdAt": "2025-01-15T10:00:00.000Z",
 *       "usageCount": 100
 *     }
 *   ],
 *   "pagination": {
 *     "total": 4,
 *     "page": 1,
 *     "limit": 10,
 *     "totalPages": 1
 *   }
 * }
 *
 * LAYOUT SUGGESTION:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  Jenis Penilaian                              [+ Tambah Jenis]      │
 * │  Kelola jenis penilaian untuk input nilai siswa                     │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
 * │  │ Total   │  │ Aktif   │  │ Nonaktif│  │ Digunakan│  (Stat Cards)  │
 * │  │   6     │  │   4     │  │   2     │  │   550    │                │
 * │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                 │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  Kode   │ Nama Penilaian         │ Bobot │ Status │ Digunakan│ Aksi │
 * │  ──────┼────────────────────────┼───────┼────────┼──────────┼───── │
 * │  TUGAS │ Tugas Harian           │  20%  │ ✓ Aktif│   150    │ [⋮]  │
 * │  UH    │ Ulangan Harian         │  25%  │ ✓ Aktif│   200    │ [⋮]  │
 * │  UTS   │ Ujian Tengah Semester  │  25%  │ ✓ Aktif│   100    │ [⋮]  │
 * │  UAS   │ Ujian Akhir Semester   │  30%  │ ✓ Aktif│   100    │ [⋮]  │
 * └─────────────────────────────────────────────────────────────────────┘
 * ------------------------------------------------------------------------
 */

/**
 * Get all assessment types with usage count
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {boolean} activeOnly - Filter active only (default: false)
 */
export const getAllAssessmentTypes = async (page = 1, limit = 10, activeOnly = false) => {
	const offset = (page - 1) * limit;

	let query = db
		.select({
			id: assessmentType.id,
			code: assessmentType.code,
			name: assessmentType.name,
			defaultWeight: assessmentType.defaultWeight,
			isActive: assessmentType.isActive,
			createdAt: assessmentType.createdAt
		})
		.from(assessmentType)
		.orderBy(desc(assessmentType.createdAt))
		.limit(limit)
		.offset(offset);

	if (activeOnly) {
		query = query.where(eq(assessmentType.isActive, true));
	}

	const types = await query;

	// Get usage count for each type
	const typesWithCount = await Promise.all(
		types.map(async (type) => {
			const [usage] = await db
				.select({ count: count() })
				.from(studentScores)
				.where(eq(studentScores.assessmentTypeId, type.id));

			return {
				...type,
				usageCount: usage?.count || 0
			};
		})
	);

	return typesWithCount;
};

/**
 * Count assessment types
 * @param {boolean} activeOnly - Count active only
 */
export const countAssessmentTypes = async (activeOnly = false) => {
	let query = db.select({ count: count() }).from(assessmentType);

	if (activeOnly) {
		query = query.where(eq(assessmentType.isActive, true));
	}

	const [result] = await query;
	return result;
};

/**
 * Get total usage count (how many scores use any assessment type)
 */
export const getTotalUsageCount = async () => {
	const [result] = await db.select({ count: count() }).from(studentScores);
	return result?.count || 0;
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: GET ASSESSMENT TYPE BY ID RESPONSE
 * ------------------------------------------------------------------------
 * GET /api/assessment-types/:id
 *
 * Response:
 * {
 *   "id": 1,
 *   "code": "TUGAS",
 *   "name": "Tugas Harian",
 *   "defaultWeight": 20,
 *   "isActive": true,
 *   "createdAt": "2025-01-15T10:00:00.000Z",
 *   "usageCount": 150
 * }
 * ------------------------------------------------------------------------
 */

/**
 * Get assessment type by ID
 * @param {number} id - Assessment type ID
 */
export const getAssessmentTypeById = async (id) => {
	const type = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.id, id))
		.get();

	if (!type) return null;

	// Get usage count
	const [usage] = await db
		.select({ count: count() })
		.from(studentScores)
		.where(eq(studentScores.assessmentTypeId, id));

	return {
		...type,
		usageCount: usage?.count || 0
	};
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: CREATE ASSESSMENT TYPE
 * ------------------------------------------------------------------------
 * POST /api/assessment-types
 *
 * Request Body:
 * {
 *   "code": "PRAKTIK",
 *   "name": "Penilaian Praktik",
 *   "defaultWeight": 15
 * }
 *
 * Response:
 * {
 *   "message": "Assessment type created successfully",
 *   "data": {
 *     "id": 5,
 *     "code": "PRAKTIK",
 *     "name": "Penilaian Praktik",
 *     "defaultWeight": 15,
 *     "isActive": true,
 *     "createdAt": "2025-01-29T10:00:00.000Z"
 *   }
 * }
 *
 * MODAL FORM LAYOUT:
 * ┌─────────────────────────────────────────────┐
 * │  Tambah Jenis Penilaian              [✕]   │
 * ├─────────────────────────────────────────────┤
 * │                                             │
 * │  Kode Penilaian *                           │
 * │  ┌─────────────────────────────────────┐   │
 * │  │ PRAKTIK                             │   │
 * │  └─────────────────────────────────────┘   │
 * │  Contoh: TUGAS, UH, UTS, UAS               │
 * │                                             │
 * │  Nama Penilaian *                           │
 * │  ┌─────────────────────────────────────┐   │
 * │  │ Penilaian Praktik                   │   │
 * │  └─────────────────────────────────────┘   │
 * │                                             │
 * │  Bobot Default (%)                          │
 * │  ┌─────────────────────────────────────┐   │
 * │  │ 15                                  │   │
 * │  └─────────────────────────────────────┘   │
 * │  Opsional. Bisa diatur per kelas/mapel.    │
 * │                                             │
 * ├─────────────────────────────────────────────┤
 * │                    [Batal]  [Simpan]        │
 * └─────────────────────────────────────────────┘
 * ------------------------------------------------------------------------
 */

/**
 * Create new assessment type
 * @param {Object} data - { code, name, defaultWeight? }
 */
export const createAssessmentType = async (data) => {
	const { code, name, defaultWeight } = data;

	// Validate required fields
	if (!code || !name) {
		throw new Error('Kode dan nama penilaian wajib diisi');
	}

	// Check if code already exists
	const existing = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.code, code.toUpperCase()))
		.get();

	if (existing) {
		throw new Error(`Kode penilaian "${code}" sudah digunakan`);
	}

	const newType = await db
		.insert(assessmentType)
		.values({
			code: code.toUpperCase().trim(),
			name: name.trim(),
			defaultWeight: defaultWeight || null,
			isActive: true
		})
		.returning()
		.get();

	return newType;
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: UPDATE ASSESSMENT TYPE
 * ------------------------------------------------------------------------
 * PUT /api/assessment-types/:id
 *
 * Request Body:
 * {
 *   "code": "PRAKTIK",
 *   "name": "Penilaian Praktikum",
 *   "defaultWeight": 20
 * }
 *
 * Response:
 * {
 *   "message": "Assessment type updated successfully",
 *   "data": {
 *     "id": 5,
 *     "code": "PRAKTIK",
 *     "name": "Penilaian Praktikum",
 *     "defaultWeight": 20,
 *     "isActive": true,
 *     "createdAt": "2025-01-29T10:00:00.000Z"
 *   }
 * }
 * ------------------------------------------------------------------------
 */

/**
 * Update assessment type
 * @param {number} id - Assessment type ID
 * @param {Object} data - { code?, name?, defaultWeight? }
 */
export const updateAssessmentType = async (id, data) => {
	const { code, name, defaultWeight } = data;

	// Check if exists
	const existing = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.id, id))
		.get();

	if (!existing) {
		throw new Error('Jenis penilaian tidak ditemukan');
	}

	// If changing code, check for duplicates
	if (code && code.toUpperCase() !== existing.code) {
		const duplicate = await db
			.select()
			.from(assessmentType)
			.where(eq(assessmentType.code, code.toUpperCase()))
			.get();

		if (duplicate) {
			throw new Error(`Kode penilaian "${code}" sudah digunakan`);
		}
	}

	const updateData = {};
	if (code) updateData.code = code.toUpperCase().trim();
	if (name) updateData.name = name.trim();
	if (defaultWeight !== undefined) updateData.defaultWeight = defaultWeight;

	const updated = await db
		.update(assessmentType)
		.set(updateData)
		.where(eq(assessmentType.id, id))
		.returning()
		.get();

	return updated;
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: TOGGLE ASSESSMENT TYPE STATUS
 * ------------------------------------------------------------------------
 * PATCH /api/assessment-types/:id/toggle
 *
 * Response:
 * {
 *   "message": "Status berhasil diubah",
 *   "data": {
 *     "id": 5,
 *     "code": "PRAKTIK",
 *     "name": "Penilaian Praktikum",
 *     "isActive": false,
 *     ...
 *   }
 * }
 *
 * NOTE: Nonaktifkan jenis penilaian yang sudah tidak dipakai,
 *       tapi masih perlu ditampilkan di riwayat nilai lama.
 * ------------------------------------------------------------------------
 */

/**
 * Toggle assessment type active status
 * @param {number} id - Assessment type ID
 */
export const toggleAssessmentTypeStatus = async (id) => {
	const existing = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.id, id))
		.get();

	if (!existing) {
		throw new Error('Jenis penilaian tidak ditemukan');
	}

	const updated = await db
		.update(assessmentType)
		.set({ isActive: !existing.isActive })
		.where(eq(assessmentType.id, id))
		.returning()
		.get();

	return updated;
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: DELETE ASSESSMENT TYPE
 * ------------------------------------------------------------------------
 * DELETE /api/assessment-types/:id
 *
 * Response (Success):
 * {
 *   "message": "Jenis penilaian berhasil dihapus"
 * }
 *
 * Response (Error - Has scores):
 * {
 *   "message": "Tidak dapat menghapus. Jenis penilaian ini digunakan oleh 150 nilai siswa. Nonaktifkan saja jika tidak ingin dipakai lagi."
 * }
 *
 * NOTE: Hanya bisa dihapus jika belum ada nilai yang menggunakan.
 *       Jika sudah digunakan, sarankan untuk menonaktifkan saja.
 * ------------------------------------------------------------------------
 */

/**
 * Delete assessment type (only if not used)
 * @param {number} id - Assessment type ID
 */
export const deleteAssessmentType = async (id) => {
	// Check if exists
	const existing = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.id, id))
		.get();

	if (!existing) {
		throw new Error('Jenis penilaian tidak ditemukan');
	}

	// Check if used by any scores
	const [usage] = await db
		.select({ count: count() })
		.from(studentScores)
		.where(eq(studentScores.assessmentTypeId, id));

	if (usage?.count > 0) {
		throw new Error(
			`Tidak dapat menghapus. Jenis penilaian ini digunakan oleh ${usage.count} nilai siswa. Nonaktifkan saja jika tidak ingin dipakai lagi.`
		);
	}

	await db.delete(assessmentType).where(eq(assessmentType.id, id)).run();

	return { deleted: true };
};

/*
 * ------------------------------------------------------------------------
 * MOCKUP: GET ASSESSMENT TYPES FOR DROPDOWN (LITE)
 * ------------------------------------------------------------------------
 * GET /api/assessment-types/lite
 *
 * Response:
 * [
 *   { "id": 1, "code": "TUGAS", "name": "Tugas Harian" },
 *   { "id": 2, "code": "UH", "name": "Ulangan Harian" },
 *   { "id": 3, "code": "UTS", "name": "Ujian Tengah Semester" },
 *   { "id": 4, "code": "UAS", "name": "Ujian Akhir Semester" }
 * ]
 *
 * USE CASE: Dropdown di form input nilai siswa
 * ┌─────────────────────────────────────┐
 * │ Jenis Penilaian *              [▼] │
 * ├─────────────────────────────────────┤
 * │ ○ Tugas Harian (TUGAS)             │
 * │ ○ Ulangan Harian (UH)              │
 * │ ○ Ujian Tengah Semester (UTS)      │
 * │ ○ Ujian Akhir Semester (UAS)       │
 * └─────────────────────────────────────┘
 * ------------------------------------------------------------------------
 */

/**
 * Get active assessment types for dropdown (lite version)
 * Only returns active types with minimal fields
 */
export const getAssessmentTypesLite = async () => {
	return db
		.select({
			id: assessmentType.id,
			code: assessmentType.code,
			name: assessmentType.name,
			defaultWeight: assessmentType.defaultWeight
		})
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true))
		.orderBy(assessmentType.code);
};

/*
 * ------------------------------------------------------------------------
 * SUMMARY STATS FOR DASHBOARD
 * ------------------------------------------------------------------------
 * GET /api/assessment-types/stats
 *
 * Response:
 * {
 *   "total": 6,
 *   "active": 4,
 *   "inactive": 2,
 *   "totalScoresRecorded": 550
 * }
 * ------------------------------------------------------------------------
 */

/**
 * Get assessment type statistics
 */
export const getAssessmentTypeStats = async () => {
	const [total] = await db.select({ count: count() }).from(assessmentType);
	const [active] = await db
		.select({ count: count() })
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true));
	const [scores] = await db.select({ count: count() }).from(studentScores);

	return {
		total: total?.count || 0,
		active: active?.count || 0,
		inactive: (total?.count || 0) - (active?.count || 0),
		totalScoresRecorded: scores?.count || 0
	};
};
