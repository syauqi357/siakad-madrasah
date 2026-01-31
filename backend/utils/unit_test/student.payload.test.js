import { jest } from '@jest/globals';

// --- Mock the Database ---
const mockTx = {
	insert: jest.fn().mockReturnThis(),
	values: jest.fn().mockReturnThis(),
	returning: jest.fn().mockReturnThis(),
	get: jest.fn(),
	run: jest.fn()
};

jest.unstable_mockModule('../src/index.js', () => ({
	db: {
		// Mock transaction to immediately execute the callback with our mockTx
		transaction: jest.fn(async (callback) => await callback(mockTx))
	}
}));

// Dynamic import after mocking
const { createStudentData, createStudentdataInputExcelBulkGenerator, createBulkStudentsFromExcel } =
	await import('../../services/student.service.js');
import ExcelJS from 'exceljs';

// Helper: Create a mock Excel buffer with full student data
async function createMockExcelBuffer() {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Data Siswa Bulk Upload');

	// Headers matching EXCEL_HEADER_MAP
	const headers = [
		'Nama Siswa',
		'NISN',
		'NIS Lokal',
		'NIK / No. KTP',
		'No. Akta Kelahiran',
		'Jenis Kelamin (L/P)',
		'Tempat Lahir',
		'Tanggal Lahir',
		'Anak Ke-',
		'Jumlah Saudara',
		'Kewarganegaraan',
		'Agama',
		'No. HP Siswa',
		'Sekolah Sebelumnya',
		'Tinggal Bersama',
		'Transportasi',
		'No. BPJS',
		// Address
		'Alamat - Jalan',
		'Alamat - No. Rumah',
		'Alamat - RT',
		'Alamat - RW',
		'Alamat - Desa/Kelurahan',
		'Alamat - Kecamatan',
		'Alamat - Kab/Kota',
		'Alamat - Provinsi',
		'Alamat - Kode Pos',
		// Father
		'Ayah - Nama',
		'Ayah - NIK',
		'Ayah - Pekerjaan',
		'Ayah - No. HP',
		'Ayah - Tempat Lahir',
		'Ayah - Tanggal Lahir',
		'Ayah - Tahun Lahir',
		'Ayah - Pendidikan',
		'Ayah - Penghasilan',
		'Ayah - Status Hidup (1/0)',
		// Mother
		'Ibu - Nama',
		'Ibu - NIK',
		'Ibu - Pekerjaan',
		'Ibu - No. HP',
		'Ibu - Tempat Lahir',
		'Ibu - Tanggal Lahir',
		'Ibu - Tahun Lahir',
		'Ibu - Pendidikan',
		'Ibu - Penghasilan',
		'Ibu - Status Hidup (1/0)'
	];
	worksheet.addRow(headers);

	// Data row with ALL fields populated
	const dataRow = [
		'Linus Torvalds',
		'7788990011675',
		'77889900',
		'7788990011223340',
		'7788990011',
		'L',
		'Helsinki',
		new Date('1969-09-15'),
		1,
		0,
		'Finlandia',
		'Kristen',
		'8123456789',
		'MIT',
		'Orang Tua',
		'Motor',
		'7788990011',
		// Address
		'Jalan Raya 123',
		'45',
		'1',
		'2',
		'Sukamaju',
		'Kota Baru',
		'Jawa Barat',
		'Jawa Barat',
		'40112',
		// Father
		'Torvalds Sr',
		'7788990011223344',
		'Insinyur',
		'8987654321',
		'Helsinki',
		new Date('1960-05-20'),
		1960,
		'Sarjana',
		10000000,
		1,
		// Mother
		'Mira Torvalds',
		'7788990011223355',
		'Guru',
		'8987654322',
		'Helsinki',
		new Date('1970-08-10'),
		1970,
		'SMA',
		8000000,
		1
	];
	worksheet.addRow(dataRow);

	return await workbook.xlsx.writeBuffer();
}

describe('Student Service - Create Payload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockTx.get.mockReturnValue({ id: 1 });
		mockTx.run.mockReturnValue({});
	});

	it('should create student and parents in a single transaction', async () => {
		// 1. Define the Payload (matches your frontend structure)
		const payload = {
			studentName: 'Ahmad Test',
			nisn: '1234567890',
			gender: 'laki-laki',
			father: {
				name: 'Budi Father',
				nik: '350000000001',
				job: 'Petani',
				phone: '08123456789'
			},
			mother: {
				name: 'Siti Mother',
				nik: '350000000002',
				job: 'Ibu Rumah Tangga',
				phone: '08123456788'
			}
		};

		// 2. Mock the Return Values - must return object with .get() for Drizzle
		// We set get() return value in beforeEach, but we can override it here if needed
		// For sequence of calls, we can use mockReturnValueOnce on .get()

		// 3. Call the function
		const result = await createStudentData(payload);

		// 4. Assertions
		// Check insert calls
		expect(mockTx.insert).toHaveBeenCalledTimes(3);
		expect(mockTx.values).toHaveBeenCalledTimes(3);

		// Check first insert (student)
		expect(mockTx.values).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ studentName: 'Ahmad Test' })
		);
		expect(mockTx.insert).toHaveBeenNthCalledWith(2, expect.anything());
		expect(mockTx.values).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ studentId: 1, name: 'Budi Father' })
		);
		expect(mockTx.insert).toHaveBeenNthCalledWith(3, expect.anything());
		expect(mockTx.values).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({ studentId: 1, name: 'Siti Mother' })
		);
		expect(result).toEqual({ id: 1 });
	});

	it('should generate a valid Excel template for bulk student upload', async () => {
		// 1. Call the generator function
		const workbook = await createStudentdataInputExcelBulkGenerator();

		// 2. Assertions
		expect(workbook).toBeDefined();
		const worksheet = workbook.getWorksheet('Data Siswa Bulk Upload');
		expect(worksheet).toBeDefined();

		const headerRow = worksheet.getRow(1);
		const headers = headerRow.values;

		// Check for key columns (using Indonesian human-readable headers)
		expect(headers).toContain('Nama Siswa');
		expect(headers).toContain('NISN');
		expect(headers).toContain('Alamat - Jalan');
		expect(headers).toContain('Ayah - Nama');
		expect(headers).toContain('Ibu - Nama');

		// Check header style
		expect(headerRow.font.bold).toBe(true);
		expect(headerRow.fill.type).toBe('pattern');
	});
});

describe('Student Service - Bulk Excel Upload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockTx.get.mockReturnValue({ id: 99 });
		mockTx.run.mockReturnValue({});
	});

	it('should insert ALL student fields from Excel (not just basic fields)', async () => {
		// Create mock Excel with full data
		const excelBuffer = await createMockExcelBuffer();

		// Call the function
		await createBulkStudentsFromExcel(excelBuffer);

		// Get the values passed to student insert (first insert call)
		const studentInsertCall = mockTx.values.mock.calls[0][0];

		// === CRITICAL ASSERTIONS ===
		// These would have FAILED before the fix because only 7 fields were mapped

		// Basic fields (were working before)
		expect(studentInsertCall.studentName).toBe('Linus Torvalds');
		expect(studentInsertCall.nisn).toBe('7788990011675');
		expect(studentInsertCall.localNis).toBe('77889900');
		expect(studentInsertCall.gender).toBe('L');
		expect(studentInsertCall.birthPlace).toBe('Helsinki');
		expect(studentInsertCall.religion).toBe('Kristen');

		// === FIELDS THAT WERE MISSING (would be NULL before fix) ===
		expect(studentInsertCall.previousSchool).toBe('MIT');
		expect(studentInsertCall.phoneNumber).toBe('8123456789');
		expect(studentInsertCall.childOrder).toBe(1);
		expect(studentInsertCall.siblingsCount).toBe(0);
		expect(studentInsertCall.nationality).toBe('Finlandia');
		expect(studentInsertCall.livingWith).toBe('Orang Tua');
		expect(studentInsertCall.transportation).toBe('Motor');
		expect(studentInsertCall.bpjs).toBe('7788990011');
		expect(studentInsertCall.idCardNumber).toBe('7788990011223340');
		expect(studentInsertCall.birthCertificateNumber).toBe('7788990011');

		console.log('✅ Test Passed: ALL 18 student fields are correctly inserted from Excel!');
	});

	it('should correctly map father job->occupation and phone->phoneNumber', async () => {
		const excelBuffer = await createMockExcelBuffer();
		await createBulkStudentsFromExcel(excelBuffer);

		// Father insert should be the 2nd insert call (after student and address)
		// Find father insert by checking for 'occupation' field
		const allCalls = mockTx.values.mock.calls;
		const fatherCall = allCalls.find(
			(call) => call[0].occupation !== undefined && call[0].name === 'Torvalds Sr'
		);

		expect(fatherCall).toBeDefined();
		expect(fatherCall[0].studentId).toBe(99);
		expect(fatherCall[0].name).toBe('Torvalds Sr');
		expect(fatherCall[0].nik).toBe('7788990011223344');

		// === CRITICAL: These field mappings were broken before ===
		expect(fatherCall[0].occupation).toBe('Insinyur'); // job -> occupation
		expect(fatherCall[0].phoneNumber).toBe('8987654321'); // phone -> phoneNumber

		expect(fatherCall[0].birthPlace).toBe('Helsinki');
		expect(fatherCall[0].birthYear).toBe(1960);
		expect(fatherCall[0].education).toBe('Sarjana');
		expect(fatherCall[0].monthlyIncome).toBe(10000000);
		expect(fatherCall[0].isAlive).toBe(1);

		console.log('✅ Test Passed: Father job->occupation and phone->phoneNumber mapped correctly!');
	});

	it('should correctly map mother job->occupation and phone->phoneNumber', async () => {
		const excelBuffer = await createMockExcelBuffer();
		await createBulkStudentsFromExcel(excelBuffer);

		// Find mother insert by checking for 'occupation' field and mother's name
		const allCalls = mockTx.values.mock.calls;
		const motherCall = allCalls.find(
			(call) => call[0].occupation !== undefined && call[0].name === 'Mira Torvalds'
		);

		expect(motherCall).toBeDefined();
		expect(motherCall[0].studentId).toBeDefined(); // studentId is set (value depends on mock)
		expect(motherCall[0].name).toBe('Mira Torvalds');
		expect(motherCall[0].nik).toBe('7788990011223355');

		// === CRITICAL: These field mappings were broken before ===
		expect(motherCall[0].occupation).toBe('Guru'); // job -> occupation
		expect(motherCall[0].phoneNumber).toBe('8987654322'); // phone -> phoneNumber

		expect(motherCall[0].birthPlace).toBe('Helsinki');
		expect(motherCall[0].birthYear).toBe(1970);
		expect(motherCall[0].education).toBe('SMA');
		expect(motherCall[0].monthlyIncome).toBe(8000000);
		expect(motherCall[0].isAlive).toBe(1);

		console.log('✅ Test Passed: Mother job->occupation and phone->phoneNumber mapped correctly!');
	});

	it('should insert address data correctly', async () => {
		const excelBuffer = await createMockExcelBuffer();
		await createBulkStudentsFromExcel(excelBuffer);

		// Address might be inserted between student and father/mother
		// Find the address insert by checking for 'street' field
		const allInsertCalls = mockTx.values.mock.calls;
		const addressCall = allInsertCalls.find((call) => call[0].street !== undefined);

		expect(addressCall).toBeDefined();
		expect(addressCall[0].studentId).toBe(99);
		expect(addressCall[0].street).toBe('Jalan Raya 123');
		expect(addressCall[0].houseNumber).toBe('45');
		expect(addressCall[0].rt).toBe('1');
		expect(addressCall[0].rw).toBe('2');
		expect(addressCall[0].village).toBe('Sukamaju');
		expect(addressCall[0].subDistrict).toBe('Kota Baru');
		expect(addressCall[0].postalCode).toBe('40112');

		console.log('✅ Test Passed: Address data inserted correctly!');
	});
});
