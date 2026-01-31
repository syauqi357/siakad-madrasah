import { db } from '../src/index.js';
import { Subjects } from '../src/db/schema/subjectTable.js';
import { eq } from 'drizzle-orm';

/**
 * Get all subjects
 * @returns {Array<Object>} Array of subject objects
 */
export const getAllSubjects = () => {
	return db.select().from(Subjects).all();
};

/**
 * Get subject by ID
 * @param {number} id - Subject ID
 * @returns {Object|null} Subject object or null
 */
export const getSubjectById = (id) => {
	const result = db.select().from(Subjects).where(eq(Subjects.id, id)).all();
	return result.length > 0 ? result[0] : null;
};

/**
 * Create a new subject
 * @param {Object} data - Subject data (name, subjectCode, description, kkm)
 * @returns {Object} Created subject
 */
export const createSubject = (data) => {
	const { name, subjectCode, description, kkm } = data;

	const result = db
		.insert(Subjects)
		.values({
			name,
			subjectCode,
			description: description || null,
			kkm: kkm || 75
		})
		.returning()
		.get();

	return result;
};

/**
 * Update a subject
 * @param {number} id - Subject ID
 * @param {Object} data - Updated subject data
 * @returns {Object} Updated subject
 */
export const updateSubject = (id, data) => {
	const { name, subjectCode, description, kkm } = data;

	const result = db
		.update(Subjects)
		.set({
			name,
			subjectCode,
			description,
			kkm
		})
		.where(eq(Subjects.id, id))
		.returning()
		.get();

	return result;
};

/**
 * Delete a subject
 * @param {number} id - Subject ID
 * @returns {Object} Deleted subject
 */
export const deleteSubject = (id) => {
	const result = db
		.delete(Subjects)
		.where(eq(Subjects.id, id))
		.returning()
		.get();

	return result;
};

/**
 * Get subjects count
 * @returns {number} Total number of subjects
 */
export const getSubjectsCount = () => {
	const result = db.select().from(Subjects).all();
	return result.length;
};
