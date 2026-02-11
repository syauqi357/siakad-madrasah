import { db } from '../src/index.js';
import { academicYear } from '../src/db/schema/academicYear.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all academic years ordered by most recent
 */
export const getAllAcademicYears = () => {
	return db
		.select({
			id: academicYear.id,
			name: academicYear.name,
			startYear: academicYear.startYear,
			endYear: academicYear.endYear,
			startDate: academicYear.startDate,
			endDate: academicYear.endDate,
			isActive: academicYear.isActive
		})
		.from(academicYear)
		.orderBy(desc(academicYear.startYear))
		.all();
};

/**
 * Get active academic year
 */
export const getActiveAcademicYear = () => {
	return db.select().from(academicYear).where(eq(academicYear.isActive, 1)).get();
};

/**
 * Get academic year by ID
 */
export const getAcademicYearById = (id) => {
	return db.select().from(academicYear).where(eq(academicYear.id, id)).get();
};

/**
 * Create new academic year
 */
export const createAcademicYear = (data) => {
	const { name, startYear, endYear, startDate, endDate, isActive } = data;

	// If setting as active, deactivate others first
	if (isActive) {
		db.update(academicYear).set({ isActive: 0 }).run();
	}

	const [created] = db
		.insert(academicYear)
		.values({
			name,
			startYear,
			endYear,
			startDate: startDate || null,
			endDate: endDate || null,
			isActive: isActive ? 1 : 0
		})
		.returning()
		.all();

	return created;
};

/**
 * Update academic year
 */
export const updateAcademicYear = (id, data) => {
	const existing = getAcademicYearById(id);
	if (!existing) return null;

	// If setting as active, deactivate others first
	if (data.isActive) {
		db.update(academicYear).set({ isActive: 0 }).run();
	}

	const updateData = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.startYear !== undefined) updateData.startYear = data.startYear;
	if (data.endYear !== undefined) updateData.endYear = data.endYear;
	if (data.startDate !== undefined) updateData.startDate = data.startDate;
	if (data.endDate !== undefined) updateData.endDate = data.endDate;
	if (data.isActive !== undefined) updateData.isActive = data.isActive ? 1 : 0;

	const [updated] = db
		.update(academicYear)
		.set(updateData)
		.where(eq(academicYear.id, id))
		.returning()
		.all();

	return updated;
};

/**
 * Delete academic year
 */
export const deleteAcademicYear = (id) => {
	const existing = getAcademicYearById(id);
	if (!existing) return null;

	db.delete(academicYear).where(eq(academicYear.id, id)).run();

	return { deleted: true };
};

/**
 * Get academic years for dropdown (just id and name)
 */
export const getAcademicYearsLite = () => {
	return db
		.select({
			id: academicYear.id,
			name: academicYear.name,
			isActive: academicYear.isActive
		})
		.from(academicYear)
		.orderBy(desc(academicYear.startYear))
		.all();
};
