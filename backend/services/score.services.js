import { db } from '../src/index.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { Subjects } from '../src/db/schema/subjectTable.js';
import { classSubject } from '../src/db/schema/classesSubjectTable.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { eq, sql, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';

/**
 * Fetch all class subjects with their names and teacher.
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
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

/**
 * Fetch scores for a specific class subject and pivot them by student.
 * @param {number} classSubjectId
 * @returns {Promise<Object>} { assessmentTypes, data, className, subjectName }
 */
export const getScoresByClassSubject = async (classSubjectId) => {
	// 1. Get Class and Subject Info
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

	// 2. Get all assessment types (columns)
	const assessmentTypes = await db.select().from(assessmentType);

	// 3. Get all scores for this class subject
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

	// 4. Pivot Data (Transform into Student -> Scores map)
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

	return {
		className,
		subjectName,
		assessmentTypes,
		data
	};
};

/**
 * Bulk save or update scores.
 * @param {number} classSubjectId
 * @param {number} assessmentTypeId
 * @param {Array<{studentId: number, score: number}>} scores
 * @returns {Promise<void>}
 */
export const saveBulkScores = async (classSubjectId, assessmentTypeId, scores) => {
	// Prepare data for upsert
	const valuesToInsert = scores.map((item) => ({
		studentId: item.studentId,
		classSubjectId: parseInt(classSubjectId),
		assessmentTypeId: parseInt(assessmentTypeId),
		score: parseFloat(item.score),
		assessmentDate: new Date().toISOString().split('T')[0] // Current date YYYY-MM-DD
	}));

	// Perform Upsert (Insert or Update on Conflict)
	await db
		.insert(studentScores)
		.values(valuesToInsert)
		.onConflictDoUpdate({
			target: [
				studentScores.studentId,
				studentScores.classSubjectId,
				studentScores.assessmentTypeId
			],
			set: {
				score: sql`excluded.score`, // Update with the new value
				assessmentDate: sql`excluded.assessment_date`
			}
		});
};

/**
 * Reads an Excel file buffer (single subject format), validates, and saves scores.
 * @param {Buffer} fileBuffer
 * @param {number} classSubjectId
 * @param {number} assessmentTypeId
 * @returns {Promise<{successCount: number, errors: Array<{row: number, nisn: string, error: string}>}>}
 */
export const uploadScoresFromExcel = async (fileBuffer, classSubjectId, assessmentTypeId) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer);

	const worksheet = workbook.getWorksheet(1);
	if (!worksheet) {
		throw new Error('No worksheet found in the Excel file.');
	}

	let nisnCol = -1;
	let scoreCol = -1;
	let headerRowNumber = -1;

	// Find the header row and column indices
	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		row.eachCell((cell, colNumber) => {
			const cellValue = cell.value?.toString().trim().toLowerCase();
			if (cellValue === 'nisn') {
				nisnCol = colNumber;
				headerRowNumber = rowNumber;
			}
			if (cellValue === 'score') {
				scoreCol = colNumber;
			}
		});
		if (headerRowNumber !== -1) return false; // Stop searching after header is found
	});

	if (nisnCol === -1 || scoreCol === -1) {
		throw new Error('Required columns "NISN" and/or "Score" not found in the Excel file.');
	}

	const scoresToProcess = [];
	const nisnsToFind = [];

	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber <= headerRowNumber) return;

		const nisn = row.getCell(nisnCol).value?.toString().trim();
		const score = parseFloat(row.getCell(scoreCol).value);

		if (nisn) {
			scoresToProcess.push({ row: rowNumber, nisn, score });
			nisnsToFind.push(nisn);
		}
	});

	if (nisnsToFind.length === 0) {
		return {
			successCount: 0,
			errors: [{ row: 0, nisn: '', error: 'No data found in Excel file.' }]
		};
	}

	const studentsFound = await db
		.select({ id: studentTable.id, nisn: studentTable.nisn })
		.from(studentTable)
		.where(inArray(studentTable.nisn, nisnsToFind));

	const studentNisnToIdMap = new Map(studentsFound.map((s) => [s.nisn.toString(), s.id]));

	const validScores = [];
	const errors = [];

	for (const item of scoresToProcess) {
		const studentId = studentNisnToIdMap.get(item.nisn);

		if (!studentId) {
			errors.push({ row: item.row, nisn: item.nisn, error: 'NISN not found in database.' });
		} else if (isNaN(item.score) || item.score < 0 || item.score > 100) {
			errors.push({ row: item.row, nisn: item.nisn, error: `Invalid score value: ${item.score}` });
		} else {
			validScores.push({ studentId, score: item.score });
		}
	}

	if (validScores.length > 0) {
		await saveBulkScores(classSubjectId, assessmentTypeId, validScores);
	}

	return {
		successCount: validScores.length,
		errors
	};
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
