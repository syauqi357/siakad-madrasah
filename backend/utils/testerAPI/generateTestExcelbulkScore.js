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
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// --- Import schema after db connection is established ---
import { Subjects } from '../../src/db/schema/subjectTable.js';

async function generateBulkScoreTemplate() {
	console.log('📝 Generating bulk score upload template...');

	// 1. Fetch ALL subjects to use as columns
	const allSubjects = await db.select().from(Subjects);

	if (allSubjects.length === 0) {
		console.error('❌ No subjects found in the database. Please run the seed script first.');
		process.exit(1);
	}

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Bulk Scores');

	// --- Table Header ---
	// The parser will dynamically read these subject names
	const headers = ['NISN', 'Nama Siswa', ...allSubjects.map((s) => s.name)];
	const headerRow = worksheet.getRow(1);
	headerRow.values = headers;
	headerRow.font = { bold: true };

	// Set column widths
	worksheet.columns = [
		{ key: 'nisn', width: 15 },
		{ key: 'nama', width: 30 },
		...allSubjects.map((s) => ({ key: s.name, width: s.name.length + 5 }))
	];

	// --- Add Example Data Rows ---
	// Create a dynamic row object based on the subjects
	const row1 = { nisn: '1234567890', nama: 'Ahmad' };
	const row2 = { nisn: '1234567891', nama: 'Budi' };

	allSubjects.forEach((subject, index) => {
		row1[subject.name] = 80 + index * 5; // e.g., 80, 85, 90
		row2[subject.name] = 75 + index * 3; // e.g., 75, 78, 81
	});

	worksheet.addRow(row1);
	worksheet.addRow(row2);

	// --- Save the file ---
	const outputPath = path.resolve(__dirname, 'bulk_scores_upload.xlsx');
	await workbook.xlsx.writeFile(outputPath);

	console.log(`✅ Successfully created bulk score template: ${outputPath}`);
}

generateBulkScoreTemplate()
	.then(() => {
		console.log('\n🎉 Bulk template generated successfully!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('❌ Failed to generate bulk Excel file:', err);
		process.exit(1);
	});
