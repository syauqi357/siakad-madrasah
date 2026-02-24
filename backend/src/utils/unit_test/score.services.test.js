import { jest } from '@jest/globals';

// 1. Define the mock factory BEFORE importing the module under test
jest.unstable_mockModule('../src/index.js', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([
      { id: 1, name: 'Matematika' },
      { id: 2, name: 'IPA' },
    ]),
  },
}));

// 2. Dynamic import of the module under test
const { generateBulkScoreTemplate } = await import('../../services/score.services.js');

describe('Score Services - Unit Tests', () => {

  it('should generate a bulk score template with correct subject headers', async () => {
    const workbook = await generateBulkScoreTemplate();

    expect(workbook).toBeDefined();

    const worksheet = workbook.getWorksheet('Bulk Scores');
    expect(worksheet).toBeDefined();

    const headerRow = worksheet.getRow(1);
    // ExcelJS rows are 1-indexed, so values[1] is the first cell.
    // We slice(1) to remove the empty 0-index element.
    const headers = headerRow.values.slice(1);

    // Now we expect our MOCKED data ('IPA'), not the real DB data
    expect(headers).toEqual(expect.arrayContaining(['NISN', 'Nama Siswa', 'Matematika', 'IPA']));
    
    console.log('✅ Test Passed: Template headers are correct!');
  });

});
