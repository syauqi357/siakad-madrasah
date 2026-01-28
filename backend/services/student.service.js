import { db } from '../src/index.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { studentFather } from '../src/db/schema/studentFather.js';
import { studentMother } from '../src/db/schema/studentMother.js';
import { studentWali } from '../src/db/schema/studentWali.js';
import { studentAddress } from '../src/db/schema/studentAddress.js';
import { rombelStudents } from '../src/db/schema/rombelStudents.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { eq, count, isNull, or } from 'drizzle-orm';
import ExcelJS from 'exceljs';

// --- Header Mapping Configuration ---
// Key: Human Readable Header (Excel) -> Value: Internal Data Key (DB/Payload)
const EXCEL_HEADER_MAP = {
	// Student Info
	'Nama Siswa': 'studentName',
	NISN: 'nisn',
	'NIS Lokal': 'localNis',
	'NIK / No. KTP': 'idCardNumber',
	'No. Akta Kelahiran': 'birthCertificateNumber',
	'Jenis Kelamin (L/P)': 'gender',
	'Tempat Lahir': 'birthPlace',
	'Tanggal Lahir': 'birthDate', // Format: DD/MM/YYYY
	'Anak Ke-': 'childOrder',
	'Jumlah Saudara': 'siblingsCount',
	Kewarganegaraan: 'nationality',
	Agama: 'religion',
	'No. HP Siswa': 'phoneNumber',
	'Sekolah Sebelumnya': 'previousSchool',
	'Tinggal Bersama': 'livingWith',
	Transportasi: 'transportation',
	'No. BPJS': 'bpjs',

	// Address Info
	'Alamat - Jalan': 'address_street',
	'Alamat - No. Rumah': 'address_houseNumber',
	'Alamat - RT': 'address_rt',
	'Alamat - RW': 'address_rw',
	'Alamat - Desa/Kelurahan': 'address_village',
	'Alamat - Kecamatan': 'address_subDistrict',
	'Alamat - Kab/Kota': 'address_district', // or regency
	'Alamat - Provinsi': 'address_province',
	'Alamat - Kode Pos': 'address_postalCode',

	// Father Info
	'Ayah - Nama': 'father_name',
	'Ayah - NIK': 'father_nik',
	'Ayah - Pekerjaan': 'father_job',
	'Ayah - No. HP': 'father_phone',
	'Ayah - Tempat Lahir': 'father_birthPlace',
	'Ayah - Tanggal Lahir': 'father_birthDate', // Format: DD/MM/YYYY
	'Ayah - Tahun Lahir': 'father_birthYear',
	'Ayah - Pendidikan': 'father_education',
	'Ayah - Penghasilan': 'father_monthlyIncome',
	'Ayah - Status Hidup (1/0)': 'father_isAlive',

	// Mother Info
	'Ibu - Nama': 'mother_name',
	'Ibu - NIK': 'mother_nik',
	'Ibu - Pekerjaan': 'mother_job',
	'Ibu - No. HP': 'mother_phone',
	'Ibu - Tempat Lahir': 'mother_birthPlace',
	'Ibu - Tanggal Lahir': 'mother_birthDate', // Format: DD/MM/YYYY
	'Ibu - Tahun Lahir': 'mother_birthYear',
	'Ibu - Pendidikan': 'mother_education',
	'Ibu - Penghasilan': 'mother_monthlyIncome',
	'Ibu - Status Hidup (1/0)': 'mother_isAlive'
};

// Reverse Map for Generator (Internal Key -> Human Header)
const HUMAN_HEADERS = Object.keys(EXCEL_HEADER_MAP);

/**
 * Generates an Excel template for bulk student data entry.
 * @returns {Promise<ExcelJS.Workbook>}
 */
export const createStudentdataInputExcelBulkGenerator = async () => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Data Siswa Bulk Upload');

	// Use the Human Readable Headers
	const headerRow = worksheet.getRow(1);
	headerRow.values = HUMAN_HEADERS;

	// Styling
	headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
	headerRow.fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF628141' } // Blue color
	};
	headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
	headerRow.height = 30;

	// Set column widths dynamically based on header length
	worksheet.columns = HUMAN_HEADERS.map((header) => {
		// Default config
		let colConfig = {
			header: header,
			key: header,
			width: Math.max(20, header.length + 5)
		};

		// Apply Date Format to specific columns
		if (header.includes('Tanggal Lahir')) {
			colConfig.style = { numFmt: 'dd/mm/yyyy' };
		}
		// Apply Text Format to ID columns to prevent scientific notation (e.g. 3.5E+15)
		if (header.includes('NIK') || header.includes('NISN') || header.includes('HP')) {
			colConfig.style = { numFmt: '@' }; // Text format
		}

		return colConfig;
	});

	// Add data validation or comments (Optional but helpful)
	worksheet.getCell('F1').note = 'Isi dengan "Laki-laki" atau "Perempuan"';

	// Find the column index for 'Tanggal Lahir' to add a specific note
	const dobIndex = HUMAN_HEADERS.indexOf('Tanggal Lahir (YYYY-MM-DD)');
	if (dobIndex !== -1) {
		// ExcelJS uses 1-based indexing for columns, but getCell can take column letter.
		// Easier to just add a general note or find the cell if needed.
		// For now, let's just update the note we had before.
		// worksheet.getCell(1, dobIndex + 1).note = 'Format: DD/MM/YYYY (Contoh: 20/05/2010)';
	}

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
			originRegion: studentTable.originRegion,
			className: rombel.name // Fetch the class name
		})
		.from(studentTable)
		.leftJoin(rombelStudents, eq(studentTable.id, rombelStudents.studentId))
		.leftJoin(rombel, eq(rombelStudents.rombelId, rombel.id))
		.limit(limit)
		.offset(offset);
};

// ... existing code ...

export const findAllStudentsLite = async () => {
	// Filter out students who are already in a VALID rombel
	// We explicitly check if the rombel exists. using Left Join on rombel.
	return db
		.select({
			id: studentTable.id,
			name: studentTable.studentName,
			nisn: studentTable.nisn
		})
		.from(studentTable)
		.leftJoin(rombelStudents, eq(studentTable.id, rombelStudents.studentId))
		.leftJoin(rombel, eq(rombelStudents.rombelId, rombel.id))
		.where(
			or(
				isNull(rombelStudents.studentId), // Truly unassigned
				isNull(rombel.id) // Assigned to a deleted/ghost rombel
			)
		);
};

export const searchStudents = async (searchTerm) => {
	// using debounce methods
};

export const countStudents = async () => {
	const [result] = await db.select({ count: count() }).from(studentTable);
	return result;
};

export const findStudentById = async (id) => {
	console.log(`[findStudentById] Searching for student ID: ${id}`);

	const student = await db.select().from(studentTable).where(eq(studentTable.id, id)).get();

	if (!student) {
		console.log(`[findStudentById] Student not found for ID: ${id}`);
		return null;
	}
	console.log(`[findStudentById] Found student:`, student.studentName);

	const address = await db
		.select()
		.from(studentAddress)
		.where(eq(studentAddress.studentId, id))
		.get();
	console.log(`[findStudentById] Address found:`, address ? 'Yes' : 'No');

	const father = await db.select().from(studentFather).where(eq(studentFather.studentId, id)).get();
	const mother = await db.select().from(studentMother).where(eq(studentMother.studentId, id)).get();
	const guardian = await db.select().from(studentWali).where(eq(studentWali.studentId, id)).get();

	return {
		...student,
		address: address || null, // Ensure null is returned instead of undefined for JSON
		father: father || null,
		mother: mother || null,
		guardian: guardian || null
	};
};

/**
 * Creates a new student and their related data in a single transaction.
 * @param {Object} payload - The full JSON payload from the frontend.
 */
export const createStudentData = (payload) => {
	return db.transaction((tx) => {
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
		const newStudent = tx.insert(studentTable).values(studentData).returning().get();
		const studentId = newStudent.id;

		// 3. Insert Address (if provided)
		if (payload.address) {
			tx.insert(studentAddress)
				.values({
					studentId: studentId,
					...payload.address
				})
				.run();
		}

		// 4. Insert Father (if provided)
		if (payload.father && payload.father.name) {
			tx.insert(studentFather)
				.values({
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
				})
				.run();
		}

		// 5. Insert Mother (if provided)
		if (payload.mother && payload.mother.name) {
			tx.insert(studentMother)
				.values({
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
				})
				.run();
		}

		// 6. Insert Guardian (if provided)
		const guardian = payload.guardian || payload.wali;
		if (guardian && guardian.name) {
			tx.insert(studentWali)
				.values({
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
				})
				.run();
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
	const headerRow = worksheet.getRow(1).values; // Array of human headers

	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return; // Skip header row

		const rowData = {};

		// Map Human Headers back to Internal Keys
		row.values.forEach((value, index) => {
			// ExcelJS values array is 1-indexed, but sometimes 0-indexed depending on parsing
			// headerRow is usually [empty, 'Header1', 'Header2'...]
			const humanHeader = headerRow[index];
			if (humanHeader && EXCEL_HEADER_MAP[humanHeader]) {
				const internalKey = EXCEL_HEADER_MAP[humanHeader];

				// Handle Date Objects from Excel
				if (value instanceof Date) {
					// Convert to YYYY-MM-DD string for DB
					rowData[internalKey] = value.toISOString().split('T')[0];
				} else {
					rowData[internalKey] = value;
				}
			}
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
				regency: rowData.address_regency, // Map district/regency correctly
				province: rowData.address_province,
				postalCode: rowData.address_postalCode
			},
			father: {
				name: rowData.father_name,
				nik: rowData.father_nik,
				job: rowData.father_job,
				phone: rowData.father_phone,
				birthPlace: rowData.father_birthPlace,
				birthDate: rowData.father_birthDate,
				birthYear: rowData.father_birthYear,
				education: rowData.father_education,
				monthlyIncome: rowData.father_monthlyIncome,
				isAlive: rowData.father_isAlive
			},
			mother: {
				name: rowData.mother_name,
				nik: rowData.mother_nik,
				job: rowData.mother_job,
				phone: rowData.mother_phone,
				birthPlace: rowData.mother_birthPlace,
				birthDate: rowData.mother_birthDate,
				birthYear: rowData.mother_birthYear,
				education: rowData.mother_education,
				monthlyIncome: rowData.mother_monthlyIncome,
				isAlive: rowData.mother_isAlive
			}
		};
		payloads.push(payload);
	});

	// Now, run the transaction for all payloads
	return db.transaction((tx) => {
		const results = [];
		for (const payload of payloads) {
			// Insert student with ALL fields (matching createStudentData logic)
			const newStudent = tx
				.insert(studentTable)
				.values({
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
				})
				.returning()
				.get();

			const studentId = newStudent.id;

			if (payload.address) {
				tx.insert(studentAddress)
					.values({ studentId, ...payload.address })
					.run();
			}
			if (payload.father && payload.father.name) {
				tx.insert(studentFather)
					.values({
						studentId,
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
					})
					.run();
			}
			if (payload.mother && payload.mother.name) {
				tx.insert(studentMother)
					.values({
						studentId,
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
					})
					.run();
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
