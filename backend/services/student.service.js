import { db } from '../src/index.js';
import { studentTable } from '../src/index.js';
import { studentFather } from '../src/db/schema/studentFather.js';
import { studentMother } from '../src/db/schema/studentMother.js';
import { studentWali } from '../src/db/schema/studentWali.js';
import { studentAddress } from '../src/db/schema/studentAddress.js';
import { rombelStudents } from '../src/index.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { studentHistory } from '../src/db/schema/studentHistory.js';
import { eq, count, isNull, or, and, sql, like } from 'drizzle-orm';
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
	'Jenis Kelamin': 'gender',
	'Tempat Lahir': 'birthPlace',
	'Tanggal Lahir': 'birthDate',
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
	'Alamat - Kab/Kota': 'address_district',
	'Alamat - Provinsi': 'address_province',
	'Alamat - Kode Pos': 'address_postalCode',

	// Father Info
	'Ayah - Nama': 'father_name',
	'Ayah - NIK': 'father_nik',
	'Ayah - Pekerjaan': 'father_job',
	'Ayah - No. HP': 'father_phone',
	'Ayah - Tempat Lahir': 'father_birthPlace',
	'Ayah - Tanggal Lahir': 'father_birthDate',
	'Ayah - Tahun Lahir': 'father_birthYear',
	'Ayah - Pendidikan': 'father_education',
	'Ayah - Penghasilan': 'father_monthlyIncome',
	'Ayah - Status': 'father_isAlive',

	// Mother Info
	'Ibu - Nama': 'mother_name',
	'Ibu - NIK': 'mother_nik',
	'Ibu - Pekerjaan': 'mother_job',
	'Ibu - No. HP': 'mother_phone',
	'Ibu - Tempat Lahir': 'mother_birthPlace',
	'Ibu - Tanggal Lahir': 'mother_birthDate',
	'Ibu - Tahun Lahir': 'mother_birthYear',
	'Ibu - Pendidikan': 'mother_education',
	'Ibu - Penghasilan': 'mother_monthlyIncome',
	'Ibu - Status': 'mother_isAlive'
};

// Values that need conversion from human-readable to DB values during upload
const VALUE_CONVERTERS = {
	gender: (val) => {
		const v = String(val).trim().toLowerCase();
		if (v === 'laki-laki' || v === 'l') return 'Laki-laki';
		if (v === 'perempuan' || v === 'p') return 'Perempuan';
		return val;
	},
	father_isAlive: (val) => {
		const v = String(val).trim().toLowerCase();
		if (v === 'hidup' || v === '1') return 1;
		if (v === 'meninggal' || v === '0') return 0;
		return val;
	},
	mother_isAlive: (val) => {
		const v = String(val).trim().toLowerCase();
		if (v === 'hidup' || v === '1') return 1;
		if (v === 'meninggal' || v === '0') return 0;
		return val;
	}
};

// Section color config for grouped header styling
const SECTION_COLORS = {
	student: 'FF2E7D32', // Green
	address: 'FF1565C0', // Blue
	father: 'FF6A1B9A', // Purple
	mother: 'FFC62828' // Red
};

const SECTION_RANGES = {
	student: { start: 'Nama Siswa', end: 'No. BPJS' },
	address: { start: 'Alamat - Jalan', end: 'Alamat - Kode Pos' },
	father: { start: 'Ayah - Nama', end: 'Ayah - Status' },
	mother: { start: 'Ibu - Nama', end: 'Ibu - Status' }
};

// Reverse Map for Generator (Internal Key -> Human Header)
const HUMAN_HEADERS = Object.keys(EXCEL_HEADER_MAP);

/**
 * Generates an Excel template for bulk student data entry.
 * @returns {Promise<ExcelJS.Workbook>}
 */
export const createStudentdataInputExcelBulkGenerator = async () => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Data Siswa');

	// Set column widths and formats
	worksheet.columns = HUMAN_HEADERS.map((header) => {
		let colConfig = {
			header: header,
			key: header,
			width: Math.max(20, header.length + 5)
		};

		if (header.includes('Tanggal Lahir')) {
			colConfig.style = { numFmt: 'dd/mm/yyyy' };
		}
		if (header.includes('NIK') || header.includes('NISN') || header.includes('HP') || header.includes('No. BPJS') || header.includes('Akta')) {
			colConfig.style = { numFmt: '@' };
		}

		return colConfig;
	});

	// Style header row with section-based colors
	const headerRow = worksheet.getRow(1);
	headerRow.values = HUMAN_HEADERS;
	headerRow.height = 32;

	// Helper to get section color for a header
	const getSectionColor = (header) => {
		for (const [section, range] of Object.entries(SECTION_RANGES)) {
			const startIdx = HUMAN_HEADERS.indexOf(range.start);
			const endIdx = HUMAN_HEADERS.indexOf(range.end);
			const headerIdx = HUMAN_HEADERS.indexOf(header);
			if (headerIdx >= startIdx && headerIdx <= endIdx) {
				return SECTION_COLORS[section];
			}
		}
		return SECTION_COLORS.student;
	};

	HUMAN_HEADERS.forEach((header, index) => {
		const cell = headerRow.getCell(index + 1);
		cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: getSectionColor(header) }
		};
		cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
		cell.border = {
			top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
		};
	});

	// Data validation dropdowns (rows 2-500)
	const MAX_ROW = 500;

	const findColLetter = (headerName) => {
		const idx = HUMAN_HEADERS.indexOf(headerName);
		if (idx === -1) return null;
		// Convert 0-based index to Excel column letter
		let col = '';
		let n = idx;
		while (n >= 0) {
			col = String.fromCharCode(65 + (n % 26)) + col;
			n = Math.floor(n / 26) - 1;
		}
		return col;
	};

	// Gender dropdown
	const genderCol = findColLetter('Jenis Kelamin');
	if (genderCol) {
		worksheet.dataValidations.add(`${genderCol}2:${genderCol}${MAX_ROW}`, {
			type: 'list',
			allowBlank: true,
			formulae: ['"Laki-laki,Perempuan"'],
			showErrorMessage: true,
			errorTitle: 'Jenis Kelamin',
			error: 'Pilih Laki-laki atau Perempuan'
		});
	}

	// Religion dropdown
	const religionCol = findColLetter('Agama');
	if (religionCol) {
		worksheet.dataValidations.add(`${religionCol}2:${religionCol}${MAX_ROW}`, {
			type: 'list',
			allowBlank: true,
			formulae: ['"Islam,Kristen,Katolik,Hindu,Buddha,Konghucu"'],
			showErrorMessage: true,
			errorTitle: 'Agama',
			error: 'Pilih salah satu agama dari daftar'
		});
	}

	// Father status dropdown
	const fatherStatusCol = findColLetter('Ayah - Status');
	if (fatherStatusCol) {
		worksheet.dataValidations.add(`${fatherStatusCol}2:${fatherStatusCol}${MAX_ROW}`, {
			type: 'list',
			allowBlank: true,
			formulae: ['"Hidup,Meninggal"'],
			showErrorMessage: true,
			errorTitle: 'Status Ayah',
			error: 'Pilih Hidup atau Meninggal'
		});
	}

	// Mother status dropdown
	const motherStatusCol = findColLetter('Ibu - Status');
	if (motherStatusCol) {
		worksheet.dataValidations.add(`${motherStatusCol}2:${motherStatusCol}${MAX_ROW}`, {
			type: 'list',
			allowBlank: true,
			formulae: ['"Hidup,Meninggal"'],
			showErrorMessage: true,
			errorTitle: 'Status Ibu',
			error: 'Pilih Hidup atau Meninggal'
		});
	}

	// Living with dropdown
	const livingWithCol = findColLetter('Tinggal Bersama');
	if (livingWithCol) {
		worksheet.dataValidations.add(`${livingWithCol}2:${livingWithCol}${MAX_ROW}`, {
			type: 'list',
			allowBlank: true,
			formulae: ['"Orang Tua,Wali,Kos,Asrama,Lainnya"'],
			showErrorMessage: true,
			errorTitle: 'Tinggal Bersama',
			error: 'Pilih dari daftar yang tersedia'
		});
	}

	// Alternate row shading for data area (light grey on even rows)
	for (let i = 2; i <= 20; i++) {
		const row = worksheet.getRow(i);
		if (i % 2 === 0) {
			row.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFF5F5F5' }
			};
		}
		row.alignment = { vertical: 'middle' };
	}

	// Freeze the header row
	worksheet.views = [{ state: 'frozen', ySplit: 1 }];

	return workbook;
};

export const findAllStudents = async (page = 1, limit = 5) => {
	const offset = (page - 1) * limit;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion,
			status: studentTable.status,
			className: rombel.name
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

/**
 * Search students by name, NISN, or local NIS
 * Note: Debounce should be implemented on the frontend side
 * @param {string} searchTerm - The search query
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {string} status - Optional status filter ('ACTIVE', 'MUTASI', 'GRADUATE')
 */
export const searchStudents = async (searchTerm, page = 1, limit = 10, status = null) => {
	if (!searchTerm || searchTerm.trim() === '') {
		return [];
	}

	const offset = (page - 1) * limit;
	const searchPattern = `%${searchTerm.trim()}%`;

	// Build search conditions
	const searchConditions = or(
		like(studentTable.studentName, searchPattern),
		like(sql`CAST(${studentTable.nisn} AS TEXT)`, searchPattern),
		like(sql`CAST(${studentTable.localNis} AS TEXT)`, searchPattern)
	);

	// Combine with status filter if provided
	const whereCondition =
		status && ['ACTIVE', 'MUTASI', 'GRADUATE'].includes(status)
			? and(searchConditions, eq(studentTable.status, status))
			: searchConditions;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			localNis: studentTable.localNis,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion,
			status: studentTable.status,
			className: rombel.name
		})
		.from(studentTable)
		.leftJoin(rombelStudents, eq(studentTable.id, rombelStudents.studentId))
		.leftJoin(rombel, eq(rombelStudents.rombelId, rombel.id))
		.where(whereCondition)
		.limit(limit)
		.offset(offset);
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
	try {
		await workbook.xlsx.load(fileBuffer);
	} catch (e) {
		throw new Error('BULK_INVALID_FILE');
	}

	const worksheet = workbook.getWorksheet(1);
	if (!worksheet) {
		throw new Error('BULK_NO_WORKSHEET');
	}

	const payloads = [];
	const headerRow = worksheet.getRow(1).values; // Array of human headers

	// Validate that file uses the correct template by checking required headers
	const requiredHeaders = ['Nama Siswa', 'NISN', 'Jenis Kelamin', 'Tempat Lahir'];
	const fileHeaders = Array.isArray(headerRow) ? headerRow.filter(Boolean).map(String) : [];
	const missingHeaders = requiredHeaders.filter((h) => !fileHeaders.includes(h));
	if (missingHeaders.length > 0) {
		throw new Error('BULK_WRONG_TEMPLATE');
	}

	// Count data rows (excluding header)
	let dataRowCount = 0;
	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber > 1) dataRowCount++;
	});
	if (dataRowCount === 0) {
		throw new Error('BULK_EMPTY_DATA');
	}

	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return; // Skip header row

		const rowData = {};

		// Map Human Headers back to Internal Keys
		row.values.forEach((value, index) => {
			const humanHeader = headerRow[index];
			if (humanHeader && EXCEL_HEADER_MAP[humanHeader]) {
				const internalKey = EXCEL_HEADER_MAP[humanHeader];

				// Handle Date Objects from Excel
				if (value instanceof Date) {
					rowData[internalKey] = value.toISOString().split('T')[0];
				} else if (VALUE_CONVERTERS[internalKey]) {
					// Convert human-readable values (e.g. "Hidup" -> 1, "Laki-laki" -> "Laki-laki")
					rowData[internalKey] = VALUE_CONVERTERS[internalKey](value);
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

// ==================== STATUS MANAGEMENT METHODS ====================

/**
 * Get all active students (status = 'ACTIVE')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export const getActiveStudents = async (page = 1, limit = 10) => {
	const offset = (page - 1) * limit;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion,
			status: studentTable.status,
			className: rombel.name
		})
		.from(studentTable)
		.leftJoin(
			rombelStudents,
			and(eq(studentTable.id, rombelStudents.studentId), eq(rombelStudents.isActive, true))
		)
		.leftJoin(rombel, eq(rombelStudents.rombelId, rombel.id))
		.where(eq(studentTable.status, 'ACTIVE'))
		.limit(limit)
		.offset(offset);
};

/**
 * Get all dropout students (status = 'MUTASI')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export const getDropoutStudents = async (page = 1, limit = 10) => {
	const offset = (page - 1) * limit;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion,
			status: studentTable.status,
			reason: studentHistory.reason,
			mutasiType: studentHistory.mutasiType,
			destinationSchool: studentHistory.destinationSchool,
			completionDate: studentHistory.completionDate,
			lastClassName: rombel.name
		})
		.from(studentTable)
		.leftJoin(studentHistory, eq(studentTable.id, studentHistory.studentId))
		.leftJoin(rombel, eq(studentHistory.rombelId, rombel.id))
		.where(eq(studentTable.status, 'MUTASI'))
		.limit(limit)
		.offset(offset);
};

/**
 * Get all graduated students (status = 'GRADUATE')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export const getGraduatedStudents = async (page = 1, limit = 10) => {
	const offset = (page - 1) * limit;

	return db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			name: studentTable.studentName,
			gender: studentTable.gender,
			originRegion: studentTable.originRegion,
			status: studentTable.status,
			scores: studentHistory.scores,
			completionDate: studentHistory.completionDate,
			lastClassName: rombel.name
		})
		.from(studentTable)
		.leftJoin(studentHistory, eq(studentTable.id, studentHistory.studentId))
		.leftJoin(rombel, eq(studentHistory.rombelId, rombel.id))
		.where(eq(studentTable.status, 'GRADUATE'))
		.limit(limit)
		.offset(offset);
};

/**
 * Count students by status
 * @param {string} status - 'ACTIVE', 'MUTASI', or 'GRADUATE'
 */
export const countStudentsByStatus = async (status) => {
	const [result] = await db
		.select({ count: count() })
		.from(studentTable)
		.where(eq(studentTable.status, status));
	return result;
};

/**
 * Change student status (TRANSACTIONAL)
 * Only allows transition from ACTIVE to MUTASI or GRADUATE
 * @param {number} studentId - The student ID
 * @param {string} newStatus - 'MUTASI' or 'GRADUATE'
 * @param {Object} data - { reason, mutasiType, destinationSchool, completionDate, scores }
 */

/**
 * Update student profile photo
 * @param {number} studentId - The student ID
 * @param {string} photoPath - The relative path to the photo file
 */
export const updateStudentPhoto = async (studentId, photoPath) => {
	const student = await db.select().from(studentTable).where(eq(studentTable.id, studentId)).get();

	if (!student) {
		throw new Error('Student not found');
	}

	const updated = await db
		.update(studentTable)
		.set({ profilePhoto: photoPath, updatedAt: new Date().toISOString() })
		.where(eq(studentTable.id, studentId))
		.returning();

	return updated[0];
};

export const changeStudentStatus = async (studentId, newStatus, data = {}) => {
	// Validate newStatus
	if (!['MUTASI', 'GRADUATE'].includes(newStatus)) {
		throw new Error('Invalid status. Must be MUTASI or GRADUATE');
	}

	// Get current student
	const student = await db.select().from(studentTable).where(eq(studentTable.id, studentId)).get();

	if (!student) {
		throw new Error('Student not found');
	}

	if (student.status !== 'ACTIVE') {
		throw new Error('Only ACTIVE students can change status');
	}

	// Validate MUTASI requirements
	if (newStatus === 'MUTASI') {
		if (!data.reason) {
			throw new Error('Alasan mutasi wajib diisi');
		}
		if (!data.mutasiType) {
			throw new Error('Jenis mutasi wajib dipilih');
		}
	}

	// Get current active rombel assignment (optional - student might not be in rombel)
	const activeRombel = await db
		.select()
		.from(rombelStudents)
		.where(and(eq(rombelStudents.studentId, studentId), eq(rombelStudents.isActive, true)))
		.get();

	const now = new Date().toISOString();

	// Execute transaction
	return db.transaction((tx) => {
		// 1. Update student status
		tx.update(studentTable)
			.set({ status: newStatus, updatedAt: now })
			.where(eq(studentTable.id, studentId))
			.run();

		// 2. Deactivate rombel assignment if exists
		if (activeRombel) {
			tx.update(rombelStudents)
				.set({ isActive: false, leftAt: now })
				.where(
					and(
						eq(rombelStudents.studentId, studentId),
						eq(rombelStudents.rombelId, activeRombel.rombelId)
					)
				)
				.run();
		}

		// 3. Create history record
		const historyRecord = tx
			.insert(studentHistory)
			.values({
				studentId: studentId,
				rombelId: activeRombel ? activeRombel.rombelId : null,
				scores: data.scores || null,
				statusType: newStatus,
				reason: data.reason || null,
				mutasiType: data.mutasiType || null,
				destinationSchool: data.destinationSchool || null,
				completionDate: data.completionDate || now
			})
			.returning()
			.get();

		return {
			student: { id: studentId, status: newStatus },
			history: historyRecord
		};
	});
};
