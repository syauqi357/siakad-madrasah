import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/index.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { Subjects } from '../src/db/schema/subjectTable.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTestExcel() {
	console.log('📝 Creating dynamic test Excel file...');

	// 1. Fetch real data from the database
	console.log('🔍 Fetching class and subject from database...');
	const classData = await db.select().from(classes).limit(1);
	const subjectData = await db.select().from(Subjects).limit(1);

	if (classData.length === 0 || subjectData.length === 0) {
		console.error('❌ Database is empty. Please run the seed script (`node seed.js`) first.');
		process.exit(1); // Exit with an error
	}

	const className = classData[0].className;
	const subjectName = subjectData[0].name;
	console.log(`Found Class: ${className}, Subject: ${subjectName}`);

	// 2. Create the Excel workbook
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Scores Upload');

	// --- Header Information (now dynamic) ---
	worksheet.mergeCells('A1:C1');
	const titleCell = worksheet.getCell('A1');
	titleCell.value = 'Data Nilai untuk di-Upload';
	titleCell.font = { name: 'Calibri', size: 16, bold: true };
	titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.getCell('A3').value = 'Kelas';
	worksheet.getCell('B3').value = `: ${className}`; // Dynamic Class Name
	worksheet.getCell('A4').value = 'Mata Pelajaran';
	worksheet.getCell('B4').value = `: ${subjectName}`; // Dynamic Subject Name

	// --- Table Header ---
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
		{ nisn: '1234567890', nama: 'Ahmad', score: 88 },
		{ nisn: '1234567891', nama: 'Budi', score: 92 },
		{ nisn: '1234567892', nama: 'Citra', score: 76 },
		{ nisn: '9999999999', nama: 'Siswa Hantu', score: 80 },
		{ nisn: '1234567890', nama: 'Ahmad (Error Test)', score: 105 },
		{ nisn: '1234567891', nama: 'Budi (Error Test)', score: 'abc' }
	];

	worksheet.addRows(data);

	// 3. Save the file
	const outputPath = path.resolve(__dirname, 'test_scores_upload.xlsx');
	await workbook.xlsx.writeFile(outputPath);

	console.log(`✅ Successfully created dynamic test Excel file at: ${outputPath}`);
}

generateTestExcel()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error('❌ Failed to generate Excel file:', err);
		process.exit(1);
	});
