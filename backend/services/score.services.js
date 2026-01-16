import { db } from '../src/index.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { eq, sql, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';

/**
 * Fetch scores for a specific class subject and pivot them by student.
 * @param {number} classSubjectId
 * @returns {Promise<Object>} { assessmentTypes, data }
 */
export const getScoresByClassSubject = async (classSubjectId) => {
	// 1. Get all assessment types (columns)
	const assessmentTypes = await db.select().from(assessmentType);

	// 2. Get all scores for this class subject
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

	// 3. Pivot Data (Transform into Student -> Scores map)
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
			target: [studentScores.studentId, studentScores.classSubjectId, studentScores.assessmentTypeId],
			set: {
				score: sql`excluded.score`, // Update with the new value
				assessmentDate: sql`excluded.assessment_date`
			}
		});
};


/**
 * Reads an Excel file buffer, validates the content, and saves the scores.
 * This version is smarter: it finds columns by header name, not by fixed position.
 * @param {Buffer} fileBuffer - The buffer of the uploaded .xlsx file.
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

	// First pass: Read all NISNs and scores from the Excel file
	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber <= headerRowNumber) return; // Skip header and any rows above it

		const nisn = row.getCell(nisnCol).value?.toString().trim();
		const score = parseFloat(row.getCell(scoreCol).value);

		if (nisn) {
			scoresToProcess.push({ row: rowNumber, nisn, score });
			nisnsToFind.push(nisn);
		}
	});

	if (nisnsToFind.length === 0) {
		return { successCount: 0, errors: [{ row: 0, nisn: '', error: 'No data found in Excel file.' }] };
	}

	// Second pass: Efficiently fetch all students from the DB in one query
	const studentsFound = await db
		.select({ id: studentTable.id, nisn: studentTable.nisn })
		.from(studentTable)
		.where(inArray(studentTable.nisn, nisnsToFind));

	const studentNisnToIdMap = new Map(studentsFound.map((s) => [s.nisn.toString(), s.id]));

	// Third pass: Validate and prepare the final payload
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

	// Final step: Save the valid scores using our existing bulk function
	if (validScores.length > 0) {
		await saveBulkScores(classSubjectId, assessmentTypeId, validScores);
	}

	return {
		successCount: validScores.length,
		errors
	};
};
