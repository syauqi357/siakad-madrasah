import { db } from '../db/index.js';
import { teachers } from '../db/schema/teacherUser.js';
import { rombel } from '../db/schema/classGroup.js';
import { classSubject } from '../db/schema/classesSubjectTable.js';
import { eq, count } from 'drizzle-orm';

/**
 * Fetches a lightweight list of all teachers (id and full name).
 * @returns {Array<Object>} An array of teacher objects with id and fullName.
 */
export const getAllTeachersLite = () => {
	return db.select({ id: teachers.id, fullName: teachers.fullName }).from(teachers).all();
};

/**
 * Fetches all teachers with full details.
 * @returns {Array<Object>} An array of all teacher objects.
 */
export const getAllTeachers = () => {
	return db.select().from(teachers).all();
};

/**
 * Fetches a single teacher by ID.
 * @param {number} id - The teacher ID.
 * @returns {Object|null} The teacher object or null if not found.
 */
export const getTeacherById = (id) => {
	const result = db.select().from(teachers).where(eq(teachers.id, id)).all();
	return result.length > 0 ? result[0] : null;
};

/**
 * Creates a new teacher.
 * @param {Object} data - The teacher data.
 * @returns {Object} The created teacher.
 */
export const createTeacher = (data) => {
	const result = db
		.insert(teachers)
		.values({
			userId: data.userId || null,
			nip: data.nip || null,
			fullName: data.fullName,
			gender: data.gender || null,
			birthPlace: data.birthPlace || null,
			birthDate: data.birthDate || null,
			religion: data.religion || null,
			phoneNumber: data.phoneNumber || null,
			personalEmail: data.personalEmail || null,
			profilePhoto: data.profilePhoto || null
		})
		.returning()
		.all();

	return result[0];
};

/**
 * Updates an existing teacher.
 * @param {number} id - The teacher ID.
 * @param {Object} data - The updated teacher data.
 * @returns {Object} The updated teacher.
 * @throws {Error} If teacher not found.
 */
export const updateTeacher = (id, data) => {
	const existing = getTeacherById(id);
	if (!existing) return null;

	const updateData = {};

	if (data.nip !== undefined) updateData.nip = data.nip;
	if (data.fullName !== undefined) updateData.fullName = data.fullName;
	if (data.gender !== undefined) updateData.gender = data.gender;
	if (data.birthPlace !== undefined) updateData.birthPlace = data.birthPlace;
	if (data.birthDate !== undefined) updateData.birthDate = data.birthDate;
	if (data.religion !== undefined) updateData.religion = data.religion;
	if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
	if (data.personalEmail !== undefined) updateData.personalEmail = data.personalEmail;
	if (data.profilePhoto !== undefined) updateData.profilePhoto = data.profilePhoto;

	const result = db.update(teachers).set(updateData).where(eq(teachers.id, id)).returning().all();

	return result[0];
};

/**
 * Deletes a teacher by ID.
 * Handles foreign key constraints by nullifying references in related tables.
 * @param {number} id - The teacher ID.
 * @returns {Object} The deleted teacher.
 */
export const deleteTeacher = (id) => {
	const existing = getTeacherById(id);
	if (!existing) return null;

	// Transaction to ensure atomic deletion and cleanup
	return db.transaction((tx) => {
		// 1. Nullify class advisor references in rombel table
		tx.update(rombel)
			.set({ classAdvisorId: null })
			.where(eq(rombel.classAdvisorId, id))
			.run();

		// 2. Nullify teacher references in classSubject table
		tx.update(classSubject)
			.set({ teacherId: null })
			.where(eq(classSubject.teacherId, id))
			.run();

		// 3. Delete the teacher record
		const result = tx.delete(teachers).where(eq(teachers.id, id)).returning().all();

		return result[0];
	});
};

export const countTeacher = () => {
	const result = db.select({ count: count() }).from(teachers).all();
	return result[0];
};
