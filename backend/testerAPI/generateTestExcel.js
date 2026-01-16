import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTestExcel() {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Scores Upload');

	console.log('📝 Creating realistic test Excel file for upload...');

    // --- Header Information ---
    // Add context so the teacher knows what this file is for.
    // The smart parser will ignore these rows.
    worksheet.mergeCells('A1:C1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Data Nilai untuk di-Upload';
    titleCell.font = { name: 'Calibri', size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('A3').value = 'Kelas';
    worksheet.getCell('B3').value = ': X IPA 1 (Example)';
    worksheet.getCell('A4').value = 'Mata Pelajaran';
    worksheet.getCell('B4').value = ': Matematika (Example)';
    
    // --- Table Header ---
    // The parser will now look for these specific header names, wherever they are.
	const headerRow = worksheet.getRow(6);
    headerRow.values = ['NISN', 'Nama Siswa', 'Score'];
    headerRow.font = { bold: true };
    
    worksheet.columns = [
		{ key: 'nisn', width: 15 },
        { key: 'nama', width: 30 },
		{ key: 'score', width: 10 }
	];

	// --- Add Data Rows ---
	const data = [
		// --- Valid Data (matches seed.js) ---
		{ nisn: '1234567890', nama: 'Ahmad', score: 88 },
		{ nisn: '1234567891', nama: 'Budi', score: 92 },
		{ nisn: '1234567892', nama: 'Citra', score: 76 },

		// --- Invalid Data (for testing error handling) ---
		{ nisn: '9999999999', nama: 'Siswa Hantu', score: 80 }, // This NISN does not exist
		{ nisn: '1234567890', nama: 'Ahmad (Error Test)', score: 105 }, // Invalid score (> 100)
        { nisn: '1234567891', nama: 'Budi (Error Test)', score: 'abc' } // Invalid score (not a number)
	];

    worksheet.addRows(data);

	// Save the file
	const outputPath = path.resolve(__dirname, 'test_scores_upload.xlsx');
	await workbook.xlsx.writeFile(outputPath);

	console.log(`✅ Successfully created test Excel file at: ${outputPath}`);
}

generateTestExcel().catch((err) => {
	console.error('❌ Failed to generate Excel file:', err);
});
