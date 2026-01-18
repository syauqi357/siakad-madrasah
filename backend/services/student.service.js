import { db } from '../src/index.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { studentFather } from '../src/db/schema/studentFather.js';
import { studentMother } from '../src/db/schema/studentMother.js';
import { studentWali } from '../src/db/schema/studentWali.js';
import { studentAddress } from '../src/db/schema/studentAddress.js';
import { eq, count } from 'drizzle-orm';

export const findAllStudents = async (page = 1, limit = 10) => {
	const offset = (page - 1) * limit;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion
		})
		.from(studentTable)
		.limit(limit)
		.offset(offset);
};

export const countStudents = async () => {
	const [result] = await db.select({ count: count() }).from(studentTable);
	return result;
};

export const findStudentById = async (id) => {
	// TODO: Join with parent and address tables to get full profile
	const student = await db.select().from(studentTable).where(eq(studentTable.id, id)).limit(1);

	return student[0];
};

/**
 * Creates a new student and their related data in a single transaction.
 * @param {Object} payload - The full JSON payload from the frontend.
 */
export const createStudentData = async (payload) => {
	return db.transaction(async (tx) => {
		// 1. Extract Student Data
		const studentData = {
			studentName: payload.studentName,
			nisn: payload.nisn,
			localNis: payload.localNis,
			gender: payload.gender,
			religion: payload.religion,
			birthPlace: payload.birthPlace,
			birthDate: payload.birthDate,
			previousSchool: payload.previousSchool,
			phoneNumber: payload.phoneNumber,
			childOrder: payload.childOrder,
			siblingsCount: payload.siblingsCount,
			originRegion: payload.originRegion,
			bpjs: payload.bpjs,
			idCardNumber: payload.idCardNumber,
			birthCertificateNumber: payload.birthCertificateNumber,
			nationality: payload.nationality,
			livingWith: payload.livingWith,
			transportation: payload.transportation
		};

		// 2. Insert Student
		const [newStudent] = await tx.insert(studentTable).values(studentData).returning();
		const studentId = newStudent.id;

		// 3. Insert Address (if provided)
		if (payload.address) {
			await tx.insert(studentAddress).values({
				studentId: studentId,
				...payload.address
			});
		}

		// 4. Insert Father (if provided)
		if (payload.father && payload.father.name) {
			await tx.insert(studentFather).values({
				studentId: studentId,
				name: payload.father.name,
				nik: payload.father.nik,
				occupation: payload.father.job,
				phoneNumber: payload.father.phone,
				birthPlace: payload.father.birthPlace,
				birthDate: payload.father.birthDate,
				birthYear: payload.father.birthYear,
				education: payload.father.education,
				monthlyIncome: payload.father.monthlyIncome,
				isAlive: payload.father.isAlive
			});
		}

		// 5. Insert Mother (if provided)
		if (payload.mother && payload.mother.name) {
			await tx.insert(studentMother).values({
				studentId: studentId,
				name: payload.mother.name,
				nik: payload.mother.nik,
				occupation: payload.mother.job,
				phoneNumber: payload.mother.phone,
				birthPlace: payload.mother.birthPlace,
				birthDate: payload.mother.birthDate,
				birthYear: payload.mother.birthYear,
				education: payload.mother.education,
				monthlyIncome: payload.mother.monthlyIncome,
				isAlive: payload.mother.isAlive
			});
		}

		// 6. Insert Guardian (if provided)
		const guardian = payload.guardian || payload.wali;
		if (guardian && guardian.name) {
			await tx.insert(studentWali).values({
				studentId: studentId,
				name: guardian.name,
				nik: guardian.nik,
				occupation: guardian.job || guardian.occupation,
				phoneNumber: guardian.phone || guardian.phoneNumber,
				birthPlace: guardian.birthPlace,
				birthDate: guardian.birthDate,
				birthYear: guardian.birthYear,
				education: guardian.education,
				monthlyIncome: guardian.monthlyIncome,
				isAlive: guardian.isAlive
			});
		}

		return newStudent;
	});
};

export const createBulkstudentData = async (data) => {
	const newBulkStudent = await db.insert(studentTable).values(data).returning();
	return data;
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
