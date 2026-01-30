import { db } from '../src/index.js';
import { classSubject } from '../src/db/schema/classesSubjectTable.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { Subjects } from '../src/db/schema/subjectTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { eq, and } from 'drizzle-orm';

/**
 * Get all class-subject assignments with related data
 * @param {number|null} classId - Optional filter by class
 */
export const getAllClassSubjects = async (classId = null) => {
	let query = db
		.select({
			id: classSubject.id,
			classId: classSubject.classId,
			className: classes.className,
			subjectId: classSubject.subjectId,
			subjectName: Subjects.name,
			subjectCode: Subjects.subjectCode,
			teacherId: classSubject.teacherId,
			teacherName: teachers.name
		})
		.from(classSubject)
		.innerJoin(classes, eq(classSubject.classId, classes.id))
		.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.leftJoin(teachers, eq(classSubject.teacherId, teachers.id));

	if (classId) {
		query = query.where(eq(classSubject.classId, classId));
	}

	return query;
};

/**
 * Get a single class-subject by ID
 */
export const getClassSubjectById = async (id) => {
	const result = await db
		.select({
			id: classSubject.id,
			classId: classSubject.classId,
			className: classes.className,
			subjectId: classSubject.subjectId,
			subjectName: Subjects.name,
			teacherId: classSubject.teacherId,
			teacherName: teachers.name
		})
		.from(classSubject)
		.innerJoin(classes, eq(classSubject.classId, classes.id))
		.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.leftJoin(teachers, eq(classSubject.teacherId, teachers.id))
		.where(eq(classSubject.id, id));

	return result[0] || null;
};

/**
 * Create a new class-subject assignment
 * @param {object} data - { classId, subjectId, teacherId? }
 */
export const createClassSubject = async (data) => {
	const { classId, subjectId, teacherId } = data;

	// Check if assignment already exists
	const existing = await db
		.select()
		.from(classSubject)
		.where(and(eq(classSubject.classId, classId), eq(classSubject.subjectId, subjectId)));

	if (existing.length > 0) {
		throw new Error('Mata pelajaran sudah ditugaskan ke kelas ini');
	}

	const result = await db
		.insert(classSubject)
		.values({
			classId,
			subjectId,
			teacherId: teacherId || null
		})
		.returning();

	return result[0];
};

/**
 * Update class-subject assignment (mainly to change teacher)
 * @param {number} id - classSubject ID
 * @param {object} data - { teacherId, classId?, subjectId? }
 */
export const updateClassSubject = async (id, data) => {
	const { teacherId, classId, subjectId } = data;

	const updateData = {};
	if (teacherId !== undefined) updateData.teacherId = teacherId || null;
	if (classId !== undefined) updateData.classId = classId;
	if (subjectId !== undefined) updateData.subjectId = subjectId;

	const result = await db
		.update(classSubject)
		.set(updateData)
		.where(eq(classSubject.id, id))
		.returning();

	return result[0];
};

/**
 * Delete class-subject assignment
 */
export const deleteClassSubject = async (id) => {
	const result = await db.delete(classSubject).where(eq(classSubject.id, id)).returning();

	return result[0];
};

/**
 * Get all classes (for dropdown)
 */
export const getClassesLite = async () => {
	return db
		.select({
			id: classes.id,
			name: classes.className
		})
		.from(classes);
};

/**
 * Get all subjects (for dropdown)
 */
export const getSubjectsLite = async () => {
	return db
		.select({
			id: Subjects.id,
			name: Subjects.name,
			code: Subjects.subjectCode
		})
		.from(Subjects);
};

/**
 * Get all teachers (for dropdown)
 */
export const getTeachersLite = async () => {
	return db
		.select({
			id: teachers.id,
			name: teachers.name
		})
		.from(teachers);
};

/**
 * Get subjects NOT yet assigned to a specific class (for "Add" dropdown)
 */
export const getUnassignedSubjects = async (classId) => {
	// Get all subjects
	const allSubjects = await db
		.select({
			id: Subjects.id,
			name: Subjects.name,
			code: Subjects.subjectCode
		})
		.from(Subjects);

	// Get assigned subject IDs for this class
	const assigned = await db
		.select({ subjectId: classSubject.subjectId })
		.from(classSubject)
		.where(eq(classSubject.classId, classId));

	const assignedIds = assigned.map((a) => a.subjectId);

	// Filter out assigned subjects
	return allSubjects.filter((s) => !assignedIds.includes(s.id));
};
