import { db } from '../src/index.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { Subjects } from '../src/db/schema/subjectTable.js';
import { classSubject } from '../src/db/schema/classesSubjectTable.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { rombelStudents } from '../src/db/schema/rombelStudents.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { eq, sql, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';

/**
 * Generates a pre-populated Excel score template for a specific rombel.
 * The template includes all students assigned to the rombel via rombelStudents table,
 * with empty score columns for each assessment type.
 * @param {number} rombelId - The ID of the rombel (class group).
 * @param {number|null} subjectId - Optional subject ID to restrict/label the template.
 * @returns {Promise<ExcelJS.Workbook>}
 */
export const generateScoreTemplateForRombel = async (rombelId, subjectId = null) => {
	// 1. Fetch rombel info for the header
	const rombelInfo = await db
		.select({
			name: rombel.name,
			classroom: rombel.classroom
		})
		.from(rombel)
		.where(eq(rombel.id, rombelId))
		.limit(1);

	const rombelName = rombelInfo[0]?.name || 'Unknown Rombel';

	let subjectName = 'Semua Mata Pelajaran';
	if (subjectId) {
		const subject = await db
			.select({ name: Subjects.name })
			.from(Subjects)
			.where(eq(Subjects.id, subjectId))
			.limit(1);
		if (subject.length > 0) {
			subjectName = subject[0].name;
		}
	}

	// 2. Fetch all students assigned to this rombel via rombelStudents junction table
	const studentsInRombel = await db
		.select({
			id: studentTable.id,
			nisn: studentTable.nisn,
			studentName: studentTable.studentName
		})
		.from(rombelStudents)
		.innerJoin(studentTable, eq(rombelStudents.studentId, studentTable.id))
		.where(eq(rombelStudents.rombelId, rombelId));

	if (studentsInRombel.length === 0) {
		throw new Error(
			`Tidak ada siswa di rombel "${rombelName}". Silakan assign siswa terlebih dahulu.`
		);
	}

	// 3. Fetch all assessment types to create the score columns
	const allAssessmentTypes = await db.select().from(assessmentType);
	const scoreHeaders = allAssessmentTypes.map((at) => at.code);

	// 4. Create the Excel Workbook
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Input Nilai');

	// 5. Add Rombel Info Header
	worksheet.mergeCells('A1:C1');
	const titleCell = worksheet.getCell('A1');
	titleCell.value = 'Template Input Nilai';
	titleCell.font = { name: 'Calibri', size: 16, bold: true };
	titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.getCell('A2').value = 'Rombel';
	worksheet.getCell('B2').value = `: ${rombelName}`;
	worksheet.getCell('A3').value = 'Mata Pelajaran';
	worksheet.getCell('B3').value = `: ${subjectName}`;
	worksheet.getCell('A4').value = 'Jumlah Siswa';
	worksheet.getCell('B4').value = `: ${studentsInRombel.length} siswa`;

	// 6. Define Table Headers at row 6: Static student info + dynamic score columns
	const headers = ['ID Siswa', 'NISN', 'Nama Siswa', ...scoreHeaders];
	const headerRow = worksheet.getRow(6);
	headerRow.values = headers;

	// Style the header
	headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
	headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
	headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
	headerRow.height = 28;

	// 7. Populate the worksheet with student data (starting at row 6)
	studentsInRombel.forEach((student) => {
		const row = worksheet.addRow([student.id, student.nisn, student.studentName]);
		// Lock the ID cell (first column) to prevent accidental edits
		row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
	});

	// 8. Set column widths and formatting
	worksheet.getColumn(1).width = 10; // ID Siswa
	worksheet.getColumn(2).width = 18; // NISN
	worksheet.getColumn(2).numFmt = '@'; // Text format for NISN
	worksheet.getColumn(3).width = 35; // Nama Siswa

	// Set width for score columns
	scoreHeaders.forEach((_, index) => {
		worksheet.getColumn(4 + index).width = 12;
	});

	// Add note to guide users
	worksheet.getCell('A7').note = 'ID Siswa jangan diubah. ID ini digunakan untuk menyimpan nilai.';

	return workbook;
};

/**
 * Fetches all subjects associated with the class of a given rombel.
 * @param {number} rombelId
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export const getSubjectsForRombel = async (rombelId) => {
	// 1. Get classId from rombel
	const rombelData = await db
		.select({ classId: rombel.classId })
		.from(rombel)
		.where(eq(rombel.id, rombelId))
		.limit(1);

	if (!rombelData.length) throw new Error('Rombel not found');

	// 2. Get subjects for that class
	const subjects = await db
		.select({
			id: Subjects.id,
			name: Subjects.name,
			code: Subjects.subjectCode
		})
		.from(classSubject)
		.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.where(eq(classSubject.classId, rombelData[0].classId));

	return subjects;
};

// --- OTHER SERVICE FUNCTIONS ---

export const getAllClassSubjects = async () => {
	const result = await db
		.select({
			id: classSubject.id,
			className: classes.className,
			subjectName: Subjects.name,
			teacherName: teachers.fullName
		})
		.from(classSubject)
		.leftJoin(classes, eq(classSubject.classId, classes.id))
		.leftJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.leftJoin(teachers, eq(classSubject.teacherId, teachers.id));

	return result.map((item) => ({
		id: item.id,
		name: `${item.className || 'Unknown'} - ${item.subjectName || 'Unknown'} (${item.teacherName || 'No Teacher'})`
	}));
};

export const getScoresByClassSubject = async (classSubjectId) => {
	const classSubjectInfo = await db
		.select({
			className: classes.className,
			subjectName: Subjects.name
		})
		.from(classSubject)
		.leftJoin(classes, eq(classSubject.classId, classes.id))
		.leftJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.where(eq(classSubject.id, classSubjectId))
		.limit(1);

	const className = classSubjectInfo[0]?.className || 'Unknown Class';
	const subjectName = classSubjectInfo[0]?.subjectName || 'Unknown Subject';
	const assessmentTypes = await db.select().from(assessmentType);
	const rawScores = await db
		.select({
			studentId: studentScores.studentId,
			studentName: studentTable.studentName,
			nisn: studentTable.nisn,
			assessmentTypeId: studentScores.assessmentTypeId,
			assessmentCode: assessmentType.code,
			score: studentScores.score
		})
		.from(studentScores)
		.leftJoin(studentTable, eq(studentScores.studentId, studentTable.id))
		.leftJoin(assessmentType, eq(studentScores.assessmentTypeId, assessmentType.id))
		.where(eq(studentScores.classSubjectId, classSubjectId));

	const studentMap = new Map();
	rawScores.forEach((row) => {
		if (!studentMap.has(row.studentId)) {
			studentMap.set(row.studentId, {
				studentId: row.studentId,
				studentName: row.studentName,
				nisn: row.nisn,
				scores: {}
			});
		}
		if (row.assessmentCode) {
			studentMap.get(row.studentId).scores[row.assessmentCode] = row.score;
		}
	});

	const data = Array.from(studentMap.values());
	return { className, subjectName, assessmentTypes, data };
};

/**
 * Reads a "pivoted" Excel file (subjects as columns) and saves all scores.
 * @param {Buffer} fileBuffer
 * @param {number} classId
 * @param {number} assessmentTypeId
 * @returns {Promise<{successCount: number, errors: Array<{row: number, nisn: string, error: string}>}>}
 */
export const uploadBulkScoresFromPivotExcel = async (fileBuffer, classId, assessmentTypeId) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer);

	const worksheet = workbook.getWorksheet(1);
	if (!worksheet) throw new Error('No worksheet found.');

	const headerRow = worksheet.getRow(1).values;
	const subjectNames = headerRow.slice(3);

	const subjectsInDb = await db.select().from(Subjects).where(inArray(Subjects.name, subjectNames));
	const subjectNameToIdMap = new Map(subjectsInDb.map((s) => [s.name, s.id]));

	const classSubjectsInDb = await db
		.select()
		.from(classSubject)
		.where(eq(classSubject.classId, classId));
	const subjectIdToClassSubjectIdMap = new Map(
		classSubjectsInDb.map((cs) => [cs.subjectId, cs.id])
	);

	const scoresToProcess = [];
	const nisnsToFind = [];
	const errors = [];

	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber === 1) return;

		const nisn = row.getCell(1).value?.toString().trim();
		if (nisn) {
			nisnsToFind.push(nisn);
			subjectNames.forEach((subjectName, index) => {
				const subjectId = subjectNameToIdMap.get(subjectName);
				const classSubjectId = subjectIdToClassSubjectIdMap.get(subjectId);
				const score = parseFloat(row.getCell(3 + index).value);

				if (classSubjectId && !isNaN(score)) {
					scoresToProcess.push({ nisn, classSubjectId, score });
				}
			});
		}
	});

	const studentsFound = await db
		.select({ id: studentTable.id, nisn: studentTable.nisn })
		.from(studentTable)
		.where(inArray(studentTable.nisn, nisnsToFind));
	const studentNisnToIdMap = new Map(studentsFound.map((s) => [s.nisn.toString(), s.id]));

	const finalScoresPayload = [];
	scoresToProcess.forEach((item) => {
		const studentId = studentNisnToIdMap.get(item.nisn);
		if (studentId) {
			finalScoresPayload.push({
				studentId,
				classSubjectId: item.classSubjectId,
				assessmentTypeId,
				score: item.score,
				assessmentDate: new Date().toISOString().split('T')[0]
			});
		} else {
			errors.push({ row: 'N/A', nisn: item.nisn, error: 'NISN not found.' });
		}
	});

	if (finalScoresPayload.length > 0) {
		await db
			.insert(studentScores)
			.values(finalScoresPayload)
			.onConflictDoUpdate({
				target: [
					studentScores.studentId,
					studentScores.classSubjectId,
					studentScores.assessmentTypeId
				],
				set: { score: sql`excluded.score`, assessmentDate: sql`excluded.assessment_date` }
			});
	}

	return {
		successCount: finalScoresPayload.length,
		errors
	};
};

/**
 * Generates an Excel template for bulk score entry with dynamic subject columns.
 * This function creates the workbook in memory without saving it to a file.
 * @returns {Promise<ExcelJS.Workbook>} The generated Excel workbook object.
 */
export const generateBulkScoreTemplate = async () => {
	console.log('📝 Generating bulk score upload template in memory...');

	// 1. Fetch ALL subjects to use as columns
	const allSubjects = await db.select().from(Subjects);

	if (allSubjects.length === 0) {
		throw new Error('No subjects found in the database. Please run the seed script first.');
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

	// Note: We are NOT adding any student rows, so the teacher gets a clean template.

	return workbook;
};
