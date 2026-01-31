import { jest } from '@jest/globals';

// 1. Mock the database module BEFORE importing the service
await jest.unstable_mockModule('../src/index.js', () => ({
	db: {
		insert: jest.fn(),
		transaction: jest.fn((callback) => callback('mock-tx')) // Execute callback synchronously, passing a mock tx
	}
}));

// 2. Dynamically import the modules AFTER mocking
const { registerRombel } = await import('../../services/rombel.services.js');
const { db } = await import('../../src/index.js');

describe('Rombel Services - registerRombel', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should successfully register a rombel with students using the correct payload structure', () => {
		const payload = [
			{
				id: 1,
				tahun_ajaran: '2025/2026 Genap',
				tingkat_kelas: '10',
				nama_rombel: 'X-IPA-1',
				wali_kelas: '12345',
				nama_ruangan: 'R01',
				kurikulum: 'Kurikulum Merdeka',
				jenis_rombel: 'kelas',
				siswa: [1, 2, 3, 4, 5]
			}
		];

		// --- Mock Setup for Synchronous Chain ---

		// Mock for Rombel Insert: .values(...).returning(...).all()
		const mockRombelAll = jest.fn().mockReturnValue([{ id: 101 }]);
		const mockRombelReturning = jest.fn().mockReturnValue({ all: mockRombelAll });
		const mockRombelValues = jest.fn().mockReturnValue({ returning: mockRombelReturning });
		const mockRombelInsert = jest.fn().mockReturnValue({ values: mockRombelValues });

		// Mock for Student Insert: .values(...).run()
		const mockStudentRun = jest.fn();
		const mockStudentValues = jest.fn().mockReturnValue({ run: mockStudentRun });
		const mockStudentInsert = jest.fn().mockReturnValue({ values: mockStudentValues });

		// The transaction callback receives 'tx'. We need to ensure 'tx' has the insert method.
		// In our mock setup above, db.transaction calls the callback with 'mock-tx'.
		// But in the service code, it calls tx.insert().
		// So we need to make sure the 'tx' passed to the callback has the insert method.

		// Let's adjust the db.transaction mock to pass an object that looks like 'tx'
		const mockTx = {
			insert: jest.fn(),
			update: jest.fn()
		};

		db.transaction.mockImplementation((callback) => {
			callback(mockTx);
		});

		// Setup the mockTx.insert to return our chain mocks
		mockTx.insert
			.mockReturnValueOnce({ values: mockRombelValues }) // First call: Rombel
			.mockReturnValueOnce({ values: mockStudentValues }); // Second call: Students

		// Setup mockTx.update chain: update().set().where().run()
		const mockRun = jest.fn();
		const mockWhere = jest.fn().mockReturnValue({ run: mockRun });
		const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
		mockTx.update.mockReturnValue({ set: mockSet });

		// --- Call the service (Synchronous now) ---
		const result = registerRombel(payload);

		// --- Assertions ---
		expect(result).toEqual({ success: true, message: 'Rombel registered successfully' });

		expect(db.transaction).toHaveBeenCalled();
		expect(mockTx.insert).toHaveBeenCalledTimes(2);
		expect(mockTx.update).toHaveBeenCalledTimes(1); // Should be called once to sync studentTable

		// Verify Rombel Insert Values
		expect(mockRombelValues).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'X-IPA-1',
				classId: 10,
				classAdvisorId: 12345,
				classroom: 'R01',
				academicYearId: 1
			})
		);

		// Verify Student Insert Values
		expect(mockStudentValues).toHaveBeenCalledWith([
			{ rombelId: 101, studentId: 1 },
			{ rombelId: 101, studentId: 2 },
			{ rombelId: 101, studentId: 3 },
			{ rombelId: 101, studentId: 4 },
			{ rombelId: 101, studentId: 5 }
		]);
	});

	it('should handle payload with no students', () => {
		const payload = [
			{
				tahun_ajaran: '2025/2026 Genap',
				tingkat_kelas: '11',
				nama_rombel: 'XI-IPS-1',
				wali_kelas: '67890',
				nama_ruangan: 'R02',
				siswa: []
			}
		];

		// Mock Chain for Rombel only
		const mockRombelAll = jest.fn().mockReturnValue([{ id: 102 }]);
		const mockRombelReturning = jest.fn().mockReturnValue({ all: mockRombelAll });
		const mockRombelValues = jest.fn().mockReturnValue({ returning: mockRombelReturning });

		const mockTx = {
			insert: jest.fn()
		};

		db.transaction.mockImplementation((callback) => {
			callback(mockTx);
		});

		mockTx.insert.mockReturnValueOnce({ values: mockRombelValues });

		registerRombel(payload);

		expect(mockTx.insert).toHaveBeenCalledTimes(1);
		expect(mockRombelValues).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'XI-IPS-1'
			})
		);
	});
});
