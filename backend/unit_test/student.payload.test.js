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
const { createStudentData } = await import('../services/student.service.js');

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
        // First insert (Student) returns ID 1
        mockTx.returning.mockResolvedValueOnce([{ id: 1 }]); 
        // Second insert (Father) returns success
        mockTx.returning.mockResolvedValueOnce([{ id: 101 }]); 
        // Third insert (Mother) returns success
        mockTx.returning.mockResolvedValueOnce([{ id: 102 }]); 

        // 3. Call the function
        const result = await createStudentData(payload);

        // 4. Assertions
        
        // Check if Student was inserted
        expect(mockTx.insert).toHaveBeenNthCalledWith(1, expect.anything()); // studentTable
        expect(mockTx.values).toHaveBeenNthCalledWith(1, expect.objectContaining({
            studentName: 'Ahmad Test',
            nisn: '1234567890'
        }));

        // Check if Father was inserted with correct studentId
        expect(mockTx.insert).toHaveBeenNthCalledWith(2, expect.anything()); // studentFather
        expect(mockTx.values).toHaveBeenNthCalledWith(2, expect.objectContaining({
            studentId: 1, // Must match the mocked return ID
            name: 'Budi Father',
            nik: '350000000001'
        }));

        // Check if Mother was inserted with correct studentId
        expect(mockTx.insert).toHaveBeenNthCalledWith(3, expect.anything()); // studentMother
        expect(mockTx.values).toHaveBeenNthCalledWith(3, expect.objectContaining({
            studentId: 1,
            name: 'Siti Mother'
        }));

        // Check final result
        expect(result).toEqual({ id: 1 });
        
        console.log('✅ Test Passed: Transactional insert worked correctly!');
    });
});
