import { db } from '../src/index.js';
import { teachers } from '../src/db/schema/teacherUser.js';

/**
 * Fetches a lightweight list of all teachers (id and full name).
 * @returns {Array<Object>} An array of teacher objects with id and fullName.
 */
export const getAllTeachersLite = () => {
	return db.select({ id: teachers.id, fullName: teachers.fullName }).from(teachers).all();
};
