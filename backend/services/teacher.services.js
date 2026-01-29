import { db } from '../src/index.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { eq } from 'drizzle-orm';

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
	// Check if teacher exists
	const existing = getTeacherById(id);
	if (!existing) {
		throw new Error('Teacher not found');
	}

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
 * @param {number} id - The teacher ID.
 * @returns {Object} The deleted teacher.
 * @throws {Error} If teacher not found.
 */
export const deleteTeacher = (id) => {
	// Check if teacher exists
	const existing = getTeacherById(id);
	if (!existing) {
		throw new Error('Teacher not found');
	}

	const result = db.delete(teachers).where(eq(teachers.id, id)).returning().all();

	return result[0];
};
