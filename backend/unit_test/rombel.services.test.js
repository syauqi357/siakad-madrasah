import { jest } from '@jest/globals';

// 1. Mock the database module BEFORE importing the service
// We use unstable_mockModule because we are in an ESM environment
await jest.unstable_mockModule('../src/index.js', () => ({
	db: {
		insert: jest.fn(),
		transaction: jest.fn((callback) => callback()),
	}
}));

// 2. Dynamically import the modules AFTER mocking
const { registerRombel } = await import('../services/rombel.services.js');
const { db } = await import('../src/index.js');

describe('Rombel Services - registerRombel', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should successfully register a rombel with students using the correct payload structure', async () => {
		const payload = [
			{
				id: 1,
				tahun_ajaran: "2025/2026 Genap",
				tingkat_kelas: "10",
				nama_rombel: "X-IPA-1",
				wali_kelas: "12345",
				nama_ruangan: "R01",
				kurikulum: "Kurikulum Merdeka",
				jenis_rombel: "kelas",
				siswa: [1, 2, 3, 4, 5]
			}
		];

		// Mock the DB responses
		const mockRombelInsert = {
			values: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([{ id: 101 }])
		};
		
		const mockStudentInsert = {
			values: jest.fn().mockResolvedValue(true)
		};

		// Setup the mock return values
		db.insert
			.mockReturnValueOnce(mockRombelInsert)
			.mockReturnValueOnce(mockStudentInsert);

		// Call the service
		const result = await registerRombel(payload);

		// Assertions
		expect(result).toEqual({ success: true, message: 'Rombel registered successfully' });

		expect(db.insert).toHaveBeenCalledTimes(2);
		
		expect(mockRombelInsert.values).toHaveBeenCalledWith(expect.objectContaining({
			name: "X-IPA-1",
			classId: 10,
			classAdvisorId: 12345,
			classroom: "R01",
			academicYearId: 1 
		}));

		expect(mockStudentInsert.values).toHaveBeenCalledWith([
			{ rombelId: 101, studentId: 1 },
			{ rombelId: 101, studentId: 2 },
			{ rombelId: 101, studentId: 3 },
			{ rombelId: 101, studentId: 4 },
			{ rombelId: 101, studentId: 5 }
		]);
	});

	it('should handle payload with no students', async () => {
		const payload = [
			{
				tahun_ajaran: "2025/2026 Genap",
				tingkat_kelas: "11",
				nama_rombel: "XI-IPS-1",
				wali_kelas: "67890",
				nama_ruangan: "R02",
				siswa: []
			}
		];

		const mockRombelInsert = {
			values: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([{ id: 102 }])
		};

		db.insert.mockReturnValueOnce(mockRombelInsert);

		await registerRombel(payload);

		expect(db.insert).toHaveBeenCalledTimes(1);
		expect(mockRombelInsert.values).toHaveBeenCalledWith(expect.objectContaining({
			name: "XI-IPS-1"
		}));
	});
});
