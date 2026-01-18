import { db } from '../src/index.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { studentFather } from '../src/db/schema/studentFather.js';
import { studentMother } from '../src/db/schema/studentMother.js';
import { studentWali } from '../src/db/schema/studentWali.js';
import { studentAddress } from '../src/db/schema/studentAddress.js';
import { eq, count } from 'drizzle-orm';
import ExcelJS from 'exceljs';

/**
 * Generates an Excel template for bulk student data entry.
 * @returns {Promise<ExcelJS.Workbook>}
 */
export const createStudentdataInputExcelBulkGenerator = async () => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Bulk Student Upload');

	// Define all headers based on the flat structure
	const headers = [
		// Student Info
		'studentName',
		'nisn',
		'localNis',
		'idCardNumber',
		'birthCertificateNumber',
		'gender',
		'birthPlace',
		'birthDate',
		'childOrder',
		'siblingsCount',
		'nationality',
		'religion',
		'phoneNumber',
		'previousSchool',
		'livingWith',
		'transportation',
		'bpjs',
		// Address Info (Prefixed)
		'address_street',
		'address_houseNumber',
		'address_rt',
		'address_rw',
		'address_village',
		'address_subDistrict',
		'address_district',
		'address_regency',
		'address_province',
		'address_postalCode',
		// Father Info (Prefixed)
		'father_name',
		'father_nik',
		'father_job',
		'father_phone',
		'father_birthPlace',
		'father_birthDate',
		'father_birthYear',
		'father_education',
		'father_monthlyIncome',
		'father_isAlive',
		// Mother Info (Prefixed)
		'mother_name',
		'mother_nik',
		'mother_job',
		'mother_phone',
		'mother_birthPlace',
		'mother_birthDate',
		'mother_birthYear',
		'mother_education',
		'mother_monthlyIncome',
		'mother_isAlive'
	];

	const headerRow = worksheet.getRow(1);
	headerRow.values = headers;
	headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
	headerRow.fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF007BFF' }
	};

	// Set column widths
	worksheet.columns = headers.map((header) => ({
		header: header,
		key: header,
		width: header.length < 15 ? 20 : header.length + 5
	}));

	// Add a comment to the NISN cell to guide the user
	worksheet.getCell('B1').note = 'NISN is required and must be unique for each student.';

	return workbook;
};

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

/**
 * Parses an Excel file and creates multiple students in a single transaction.
 * @param {Buffer} fileBuffer - The buffer of the uploaded .xlsx file.
 */
export const createBulkStudentsFromExcel = async (fileBuffer) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer);
	const worksheet = workbook.getWorksheet(1);

	const payloads = [];
	const headerRow = worksheet.getRow(1).values;

	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return; // Skip header row

		const rowData = {};
		row.values.forEach((value, index) => {
			rowData[headerRow[index]] = value;
		});

		// Construct the nested payload from the flat row data
		const payload = {
			studentName: rowData.studentName,
			nisn: rowData.nisn,
			localNis: rowData.localNis,
			gender: rowData.gender,
			religion: rowData.religion,
			birthPlace: rowData.birthPlace,
			birthDate: rowData.birthDate,
			previousSchool: rowData.previousSchool,
			phoneNumber: rowData.phoneNumber,
			childOrder: rowData.childOrder,
			siblingsCount: rowData.siblingsCount,
			originRegion: rowData.originRegion,
			bpjs: rowData.bpjs,
			idCardNumber: rowData.idCardNumber,
			birthCertificateNumber: rowData.birthCertificateNumber,
			nationality: rowData.nationality,
			livingWith: rowData.livingWith,
			transportation: rowData.transportation,
			address: {
				street: rowData.address_street,
				houseNumber: rowData.address_houseNumber,
				rt: rowData.address_rt,
				rw: rowData.address_rw,
				village: rowData.address_village,
				subDistrict: rowData.address_subDistrict,
				district: rowData.address_district,
				regency: rowData.address_regency,
				province: rowData.address_province,
				postalCode: rowData.address_postalCode
			},
			father: {
				name: rowData.father_name,
				nik: rowData.father_nik,
				job: rowData.father_job,
				phone: rowData.father_phone
				// ... add all other father fields
			},
			mother: {
				name: rowData.mother_name,
				nik: rowData.mother_nik,
				job: rowData.mother_job,
				phone: rowData.mother_phone
				// ... add all other mother fields
			}
		};
		payloads.push(payload);
	});

	// Now, run the transaction for all payloads
	return db.transaction(async (tx) => {
		const results = [];
		for (const payload of payloads) {
			// This is a simplified version of the createStudentData logic
			// In a real app, you'd reuse the logic more directly
			const [newStudent] = await tx
				.insert(studentTable)
				.values({
					studentName: payload.studentName,
					nisn: payload.nisn
					// ... other student fields
				})
				.returning();

			const studentId = newStudent.id;

			if (payload.address) {
				await tx.insert(studentAddress).values({ studentId, ...payload.address });
			}
			if (payload.father) {
				await tx.insert(studentFather).values({ studentId, ...payload.father });
			}
			if (payload.mother) {
				await tx.insert(studentMother).values({ studentId, ...payload.mother });
			}
			results.push(newStudent);
		}
		return results;
	});
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
