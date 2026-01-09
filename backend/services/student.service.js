import { db } from '../src/index.js';
import { studentTable } from '../src/index.js';
import { eq, count } from 'drizzle-orm';

export const findAllStudents = async () => {
	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.name,
			class: studentTable.class,
			gender: studentTable.gender,
			cityOfOrigin: studentTable.cityOfOrigin,
			status: studentTable.status,
		})
		.from(studentTable);
};

export const countStudents = async () => {
	const [result] = await db.select({ count: count() }).from(studentTable);
	return result;
};

export const findStudentById = async (id) => {
	const student = await db
		.select()
		.from(studentTable)
		.where(eq(studentTable.id, id))
		.limit(1);
	
	return student[0];
};

export const createStudentData = async (data) => {
	const newStudent = await db.insert(studentTable).values(data).returning();
	return newStudent[0];
};

export const updateStudentData = async (id, data) => {
	const updated = await db
		.update(studentTable)
		.set(data)
		.where(eq(studentTable.id, id))
		.returning();

	return updated[0];
};

export const deleteStudentData = async (id) => {
	const deleted = await db.delete(studentTable).where(eq(studentTable.id, id)).returning();
	return deleted[0];
};
