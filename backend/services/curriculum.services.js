import { db } from '../src/index.js';
import { curriculum } from '../src/db/schema/curriculum.js';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Get all curricula ordered by most recent, with rombel usage count
 */
export const getAllCurricula = () => {
	return db
		.select({
			id: curriculum.id,
			name: curriculum.name,
			code: curriculum.code,
			year: curriculum.year,
			description: curriculum.description,
			isActive: curriculum.isActive,
			rombelCount: sql`(SELECT COUNT(*) FROM rombel WHERE CAST(rombel.kurikulum AS INTEGER) = ${curriculum.id})`.as('rombelCount')
		})
		.from(curriculum)
		.orderBy(desc(curriculum.year))
		.all();
};

/**
 * Get active curriculum
 */
export const getActiveCurriculum = () => {
	return db.select().from(curriculum).where(eq(curriculum.isActive, 1)).get();
};

/**
 * Get curriculum by ID
 */
export const getCurriculumById = (id) => {
	return db.select().from(curriculum).where(eq(curriculum.id, id)).get();
};

/**
 * Create new curriculum
 */
export const createCurriculum = (data) => {
	const { name, code, year, description, isActive } = data;

	// If setting as active, deactivate others first
	if (isActive) {
		db.update(curriculum).set({ isActive: 0 }).run();
	}

	const [created] = db
		.insert(curriculum)
		.values({
			name,
			code,
			year,
			description: description || null,
			isActive: isActive ? 1 : 0
		})
		.returning()
		.all();

	return created;
};

/**
 * Update curriculum
 */
export const updateCurriculum = (id, data) => {
	const existing = getCurriculumById(id);
	if (!existing) return null;

	// If setting as active, deactivate others first
	if (data.isActive) {
		db.update(curriculum).set({ isActive: 0 }).run();
	}

	const updateData = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.code !== undefined) updateData.code = data.code;
	if (data.year !== undefined) updateData.year = data.year;
	if (data.description !== undefined) updateData.description = data.description;
	if (data.isActive !== undefined) updateData.isActive = data.isActive ? 1 : 0;

	const [updated] = db
		.update(curriculum)
		.set(updateData)
		.where(eq(curriculum.id, id))
		.returning()
		.all();

	return updated;
};

/**
 * Delete curriculum
 */
export const deleteCurriculum = (id) => {
	const existing = getCurriculumById(id);
	if (!existing) return null;

	db.delete(curriculum).where(eq(curriculum.id, id)).run();

	return { deleted: true };
};

/**
 * Get curricula for dropdown (just id, name, code)
 */
export const getCurriculaLite = () => {
	return db
		.select({
			id: curriculum.id,
			name: curriculum.name,
			code: curriculum.code,
			isActive: curriculum.isActive
		})
		.from(curriculum)
		.orderBy(desc(curriculum.year))
		.all();
};
