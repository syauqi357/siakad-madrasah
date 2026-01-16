import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// --- Step 1: Explicitly load the .env file ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- Step 2: Create a dedicated database connection ---
if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined in your .env file.');
}
const dbPath = path.resolve(__dirname, '..', process.env.DATABASE_URL);
console.log(`🔌 Connecting to database at: ${dbPath}`);
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// --- Import schema after db connection is established ---
import { classes } from '../src/db/schema/classesDataTable.js';
import { Subjects } from '../src/db/schema/subjectTable.js';

async function generateAllTemplates() {
	console.log('📝 Generating dynamic Excel templates for all classes...');

	// 1. Fetch ALL classes and the first subject
	const allClasses = await db.select().from(classes);
	const subjectData = await db.select().from(Subjects).limit(1);

	if (allClasses.length === 0) {
		console.error('❌ No classes found in the database. Please run the seed script first.');
		process.exit(1);
	}
	if (subjectData.length === 0) {
		console.error('❌ No subjects found in the database. Please run the seed script first.');
		process.exit(1);
	}

	const subjectName = subjectData[0].name;

	// 2. Loop through each class and generate a file
	for (const classInfo of allClasses) {
		const className = classInfo.className;
		console.log(`\n--- Generating template for Class: ${className} ---`);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(`Scores - ${className}`);

		// --- Header Information ---
		worksheet.mergeCells('A1:C1');
		const titleCell = worksheet.getCell('A1');
		titleCell.value = 'Template Upload Nilai';
		titleCell.font = { name: 'Calibri', size: 16, bold: true };
		titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.getCell('A3').value = 'Kelas';
		worksheet.getCell('B3').value = `: ${className}`;
		worksheet.getCell('A4').value = 'Mata Pelajaran';
		worksheet.getCell('B4').value = `: ${subjectName}`;

		// --- Table Header ---
		const headerRow = worksheet.getRow(6);
		headerRow.values = ['NISN', 'Nama Siswa', 'Score'];
		headerRow.font = { bold: true };

		worksheet.columns = [
			{ key: 'nisn', width: 15 },
			{ key: 'nama', width: 30 },
			{ key: 'score', width: 10 }
		];

		// --- Add Example Data Rows ---
		// You can fetch real students for each class here in the future if needed
		const exampleData = [
			{ nisn: '1234567890', nama: 'Contoh Siswa 1', score: 85 },
			{ nisn: '1234567891', nama: 'Contoh Siswa 2', score: 90 }
		];
		worksheet.addRows(exampleData);

		// --- Save the file with a unique name ---
		const safeClassName = className.replace(/[^a-z0-9]/gi, '_'); // Sanitize filename
		const outputPath = path.resolve(__dirname, `upload_template_${safeClassName}.xlsx`);
		await workbook.xlsx.writeFile(outputPath);

		console.log(`✅ Successfully created template: ${outputPath}`);
	}
}

generateAllTemplates()
	.then(() => {
		console.log('\n🎉 All templates generated successfully!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('❌ Failed to generate Excel files:', err);
		process.exit(1);
	});
