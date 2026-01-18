import { jest } from '@jest/globals';

// --- Mock the Database ---
const mockTx = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
};

jest.unstable_mockModule('../src/index.js', () => ({
    db: {
        // Mock transaction to immediately execute the callback with our mockTx
        transaction: jest.fn(async (callback) => await callback(mockTx)),
    },
}));

// Dynamic import after mocking
const { createStudentData, createStudentdataInputExcelBulkGenerator } = await import('../services/student.service.js');

describe('Student Service - Create Payload', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
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

        // 2. Mock the Return Values
        mockTx.returning.mockResolvedValueOnce([{ id: 1 }]); 
        mockTx.returning.mockResolvedValueOnce([{ id: 101 }]); 
        mockTx.returning.mockResolvedValueOnce([{ id: 102 }]); 

        // 3. Call the function
        const result = await createStudentData(payload);

        // 4. Assertions
        expect(mockTx.insert).toHaveBeenNthCalledWith(1, expect.anything());
        expect(mockTx.values).toHaveBeenNthCalledWith(1, expect.objectContaining({ studentName: 'Ahmad Test' }));
        expect(mockTx.insert).toHaveBeenNthCalledWith(2, expect.anything());
        expect(mockTx.values).toHaveBeenNthCalledWith(2, expect.objectContaining({ studentId: 1, name: 'Budi Father' }));
        expect(mockTx.insert).toHaveBeenNthCalledWith(3, expect.anything());
        expect(mockTx.values).toHaveBeenNthCalledWith(3, expect.objectContaining({ studentId: 1, name: 'Siti Mother' }));
        expect(result).toEqual({ id: 1 });
        
        console.log('✅ Test Passed: Transactional insert worked correctly!');
    });

    it('should generate a valid Excel template for bulk student upload', async () => {
        // 1. Call the generator function
        const workbook = await createStudentdataInputExcelBulkGenerator();

        // 2. Assertions
        expect(workbook).toBeDefined();
        const worksheet = workbook.getWorksheet('Bulk Student Upload');
        expect(worksheet).toBeDefined();

        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values;

        // Check for key columns
        expect(headers).toContain('studentName');
        expect(headers).toContain('nisn');
        expect(headers).toContain('address_street');
        expect(headers).toContain('father_name');
        expect(headers).toContain('mother_name');

        // Check header style
        expect(headerRow.font.bold).toBe(true);
        expect(headerRow.fill.type).toBe('pattern');

        console.log('✅ Test Passed: Excel template generator created a valid workbook.');
    });
});
