import { db } from '../src/index.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { count, desc, eq } from 'drizzle-orm';

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

	return await Promise.all(
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

/**
 * Get assessment type by ID
 * @param {number} id - Assessment type ID
 */
export const getAssessmentTypeById = async (id) => {
	const type = await db.select().from(assessmentType).where(eq(assessmentType.id, id)).get();

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

	return db
		.insert(assessmentType)
		.values({
			code: code.toUpperCase().trim(),
			name: name.trim(),
			defaultWeight: defaultWeight || null,
			isActive: true
		})
		.returning()
		.get();
};

/**
 * Update assessment type
 * @param {number} id - Assessment type ID
 * @param {Object} data - { code?, name?, defaultWeight? }
 */
export const updateAssessmentType = async (id, data) => {
	const { code, name, defaultWeight } = data;

	// Check if exists
	const existing = await db.select().from(assessmentType).where(eq(assessmentType.id, id)).get();

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

	return db
		.update(assessmentType)
		.set(updateData)
		.where(eq(assessmentType.id, id))
		.returning()
		.get();
};

/**
 * Toggle assessment type active status
 * @param {number} id - Assessment type ID
 */
export const toggleAssessmentTypeStatus = async (id) => {
	const existing = await db.select().from(assessmentType).where(eq(assessmentType.id, id)).get();

	if (!existing) {
		throw new Error('Jenis penilaian tidak ditemukan');
	}

	return db
		.update(assessmentType)
		.set({ isActive: !existing.isActive })
		.where(eq(assessmentType.id, id))
		.returning()
		.get();
};

/**
 * Delete assessment type (only if not used)
 * @param {number} id - Assessment type ID
 */
export const deleteAssessmentType = async (id) => {
	// Check if exists
	const existing = await db.select().from(assessmentType).where(eq(assessmentType.id, id)).get();

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
