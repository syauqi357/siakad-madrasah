import { jest } from '@jest/globals';

// --- Mocks ---

// Mock ExcelJS
const mockWorksheet = {
	getRow: jest.fn(),
	eachRow: jest.fn()
};
const mockWorkbook = {
	xlsx: {
		load: jest.fn()
	},
	getWorksheet: jest.fn()
};

// Mock Drizzle Transaction
const mockTx = {
	insert: jest.fn().mockReturnThis(),
	values: jest.fn().mockReturnThis(),
	run: jest.fn(),
	returning: jest.fn().mockReturnThis(),
	get: jest.fn() // for .returning().get()
};

// Mock DB
const mockDb = {
	transaction: jest.fn(async (cb) => await cb(mockTx))
};

// --- Mock Modules ---

// 1. Mock 'exceljs' (default export)
jest.unstable_mockModule('exceljs', () => ({
	default: {
		Workbook: jest.fn(() => mockWorkbook)
	}
}));

// 2. Mock database connection
jest.unstable_mockModule('../src/index.js', () => ({
	db: mockDb
}));

// 3. Mock Schema Definitions (just return simple strings/objects to identify them)
jest.unstable_mockModule('../src/db/schema/studentsdataTable.js', () => ({
	studentTable: 'student_table_mock'
}));
jest.unstable_mockModule('../src/db/schema/studentFather.js', () => ({
	studentFather: 'student_father_mock'
}));
jest.unstable_mockModule('../src/db/schema/studentMother.js', () => ({
	studentMother: 'student_mother_mock'
}));
jest.unstable_mockModule('../src/db/schema/studentWali.js', () => ({
	studentWali: 'student_wali_mock'
}));
jest.unstable_mockModule('../src/db/schema/studentAddress.js', () => ({
	studentAddress: 'student_address_mock'
}));
jest.unstable_mockModule('../src/db/schema/rombelStudents.js', () => ({
	rombelStudents: 'rombel_students_mock'
}));
jest.unstable_mockModule('../src/db/schema/classGroup.js', () => ({ rombel: 'rombel_mock' }));

// Import the service AFTER mocking
const { createBulkStudentsFromExcel } = await import('../services/student.service.js');

describe('Student Service - Bulk Upload (Excel)', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Setup default Excel mock behavior
		mockWorkbook.getWorksheet.mockReturnValue(mockWorksheet);

		// Setup default DB behavior
		// When inserting student, return a mock ID
		mockTx.get.mockReturnValue({ id: 999 });
	});

	test('should correctly parse Excel and insert ALL student fields and parent data', async () => {
		// 1. Setup Mock Excel Data
		// Header Row (1-based index in ExcelJS)
		mockWorksheet.getRow.mockReturnValue({
			values: [
				null, // index 0 is usually empty in ExcelJS row.values
				'Nama Lengkap',
				'NISN',
				'NIS Lokal',
				'Jenis Kelamin',
				'Agama',
				'Tempat Lahir',
				'Tanggal Lahir',
				'Sekolah Asal',
				'No Telepon',
				'Anak Ke',
				'Jumlah Saudara',
				'Wilayah Asal',
				'BPJS',
				'No KTP',
				'No KK',
				'Kewarganegaraan',
				'Tinggal Bersama',
				'Alat Transportasi',
				// Father
				'Nama Ayah',
				'Pekerjaan Ayah',
				'No Telepon Ayah',
				// Address
				'Alamat Jalan'
			]
		});

		// Data Row
		const mockRowData = {
			values: [
				null,
				'John Doe',
				'1234567890',
				'NIS001',
				'L',
				'Islam',
				'Jakarta',
				'2010-01-01',
				'SD 1',
				'08123456789',
				'1',
				'2',
				'Jakarta',
				'BPJS123',
				'KTP123',
				'KK123',
				'WNI',
				'Orang Tua',
				'Motor',
				// Father
				'Papa Doe',
				'Engineer',
				'089999999',
				// Address
				'Jl. Sudirman'
			]
		};

		// Mock eachRow implementation
		mockWorksheet.eachRow.mockImplementation((callback) => {
			// Call for row 2 (data)
			callback(mockRowData, 2);
		});

		// 2. Call the function
		const fileBuffer = Buffer.from('dummy');
		await createBulkStudentsFromExcel(fileBuffer);

		// 3. Assertions

		// A. Verify Excel Loading
		expect(mockWorkbook.xlsx.load).toHaveBeenCalledWith(fileBuffer);

		// B. Verify Student Insert
		// Check if insert was called with studentTable
		expect(mockTx.insert).toHaveBeenCalledWith('student_table_mock');

		// Check the values passed to insert
		// We expect ALL fields to be mapped now, not just the first 7
		const studentInsertCall = mockTx.values.mock.calls.find(
			(call) => call[0].studentName === 'John Doe'
		);

		expect(studentInsertCall).toBeTruthy();
		const studentData = studentInsertCall[0];

		expect(studentData).toEqual(
			expect.objectContaining({
				studentName: 'John Doe',
				nisn: '1234567890',
				localNis: 'NIS001',
				gender: 'L',
				religion: 'Islam',
				birthPlace: 'Jakarta',
				birthDate: '2010-01-01',
				// Verify fields that were previously missing
				previousSchool: 'SD 1',
				phoneNumber: '08123456789',
				childOrder: '1',
				siblingsCount: '2',
				originRegion: 'Jakarta',
				bpjs: 'BPJS123',
				idCardNumber: 'KTP123',
				// birthCertificateNumber (not in mock data, should be undefined or null but handled)
				nationality: 'WNI',
				livingWith: 'Orang Tua',
				transportation: 'Motor'
			})
		);

		// C. Verify Father Insert
		// Check if insert was called with studentFather
		expect(mockTx.insert).toHaveBeenCalledWith('student_father_mock');

		// Check for correct field mapping (job -> occupation, phone -> phoneNumber)
		const fatherInsertCall = mockTx.values.mock.calls.find((call) => call[0].name === 'Papa Doe');
		expect(fatherInsertCall).toBeTruthy();
		expect(fatherInsertCall[0]).toEqual(
			expect.objectContaining({
				studentId: 999, // From mockTx.get
				name: 'Papa Doe',
				occupation: 'Engineer', // Should be 'occupation', NOT 'job'
				phoneNumber: '089999999' // Should be 'phoneNumber', NOT 'phone'
			})
		);

		// D. Verify Address Insert
		expect(mockTx.insert).toHaveBeenCalledWith('student_address_mock');
		const addressInsertCall = mockTx.values.mock.calls.find(
			(call) => call[0].street === 'Jl. Sudirman'
		);
		expect(addressInsertCall).toBeTruthy();
		expect(addressInsertCall[0]).toEqual(
			expect.objectContaining({
				studentId: 999,
				street: 'Jl. Sudirman'
			})
		);
	});
});
