import { db, rombelStudents, studentTable } from '../src/index.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { Subjects } from '../src/db/schema/subjectTable.js';
import { classSubject } from '../src/db/schema/classesSubjectTable.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { teachers } from '../src/db/schema/teacherUser.js';
import { rombel } from '../src/db/schema/classGroup.js';
import { and, eq, inArray, sql } from 'drizzle-orm';
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
		return { error: 'NO_STUDENTS', rombelName };
	}

	// 3. Fetch active assessment types to create the score columns
	const allAssessmentTypes = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true));
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

	if (!rombelData.length) return null;

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
	const assessmentTypes = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true));

	// Create a map of assessment type code to weight for calculation
	const typeWeightMap = new Map(assessmentTypes.map((t) => [t.code, t.defaultWeight || 0]));

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

	// Calculate total and average for each student
	const data = Array.from(studentMap.values()).map((student) => {
		const { total, average, weightedAverage } = calculateScoreTotals(student.scores, typeWeightMap);
		return {
			...student,
			total,
			average,
			weightedAverage
		};
	});

	return { className, subjectName, assessmentTypes, data };
};

/**
 * Calculates total, simple average, and weighted average from a scores object.
 * @param {Object} scores - Object with assessment codes as keys and scores as values (e.g., { UH: 85, UTS: 90 })
 * @param {Map} typeWeightMap - Map of assessment code to weight (e.g., Map([['UH', 20], ['UTS', 30]]))
 * @returns {{total: number, average: number, weightedAverage: number}}
 */
export const calculateScoreTotals = (scores, typeWeightMap) => {
	const scoreValues = Object.values(scores).filter((s) => s !== null && s !== undefined);

	if (scoreValues.length === 0) {
		return { total: 0, average: 0, weightedAverage: 0 };
	}

	// Simple total (sum of all scores)
	const total = scoreValues.reduce((sum, score) => sum + score, 0);

	// Simple average
	const average = Math.round((total / scoreValues.length) * 100) / 100;

	// Weighted average calculation
	let weightedSum = 0;
	let totalWeight = 0;

	for (const [code, score] of Object.entries(scores)) {
		if (score === null || score === undefined) continue;
		const weight = typeWeightMap.get(code) || 0;
		if (weight > 0) {
			weightedSum += score * weight;
			totalWeight += weight;
		}
	}

	const weightedAverage =
		totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : average; // Fallback to simple average if no weights defined

	return { total, average, weightedAverage };
};

/**
 * Gets score summary for a specific student across all subjects.
 * @param {number} studentId
 * @param {number|null} academicYearId - Optional filter by academic year
 * @returns {Promise<Array<{subjectName: string, scores: Object, total: number, average: number, weightedAverage: number}>>}
 */
export const getStudentScoreSummary = async (studentId, academicYearId = null) => {
	// Fetch all assessment types for weight calculation
	const assessmentTypes = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true));
	const typeWeightMap = new Map(assessmentTypes.map((t) => [t.code, t.defaultWeight || 0]));

	// Fetch all scores for this student with subject info
	const rawScores = await db
		.select({
			subjectId: Subjects.id,
			subjectName: Subjects.name,
			assessmentCode: assessmentType.code,
			score: studentScores.score,
			classSubjectId: studentScores.classSubjectId
		})
		.from(studentScores)
		.innerJoin(classSubject, eq(studentScores.classSubjectId, classSubject.id))
		.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.innerJoin(assessmentType, eq(studentScores.assessmentTypeId, assessmentType.id))
		.where(eq(studentScores.studentId, studentId));

	// Group scores by subject
	const subjectMap = new Map();
	rawScores.forEach((row) => {
		if (!subjectMap.has(row.subjectId)) {
			subjectMap.set(row.subjectId, {
				subjectId: row.subjectId,
				subjectName: row.subjectName,
				scores: {}
			});
		}
		if (row.assessmentCode) {
			subjectMap.get(row.subjectId).scores[row.assessmentCode] = row.score;
		}
	});

	// Calculate totals for each subject

	return Array.from(subjectMap.values()).map((subject) => {
		const { total, average, weightedAverage } = calculateScoreTotals(subject.scores, typeWeightMap);
		return {
			...subject,
			total,
			average,
			weightedAverage
		};
	});
};

/**
 * Gets complete score report for a rombel - all students x all subjects x all assessment types.
 * @param {number} rombelId
 * @returns {Promise<{rombelName: string, subjects: Array, assessmentTypes: Array, students: Array}>}
 */
export const getRombelScoreReport = async (rombelId) => {
	// Get rombel info
	const rombelInfo = await db
		.select({
			name: rombel.name,
			classId: rombel.classId
		})
		.from(rombel)
		.where(eq(rombel.id, rombelId))
		.limit(1);

	if (!rombelInfo.length) return null;

	const rombelName = rombelInfo[0].name;
	const classId = rombelInfo[0].classId;

	// Get all students in rombel
	const studentsInRombel = await db
		.select({
			studentId: studentTable.id,
			nisn: studentTable.nisn,
			studentName: studentTable.studentName
		})
		.from(rombelStudents)
		.innerJoin(studentTable, eq(rombelStudents.studentId, studentTable.id))
		.where(and(eq(rombelStudents.rombelId, rombelId), eq(rombelStudents.isActive, true)));

	// Get subjects for this class
	const subjects = await db
		.select({
			classSubjectId: classSubject.id,
			subjectId: Subjects.id,
			subjectName: Subjects.name
		})
		.from(classSubject)
		.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
		.where(eq(classSubject.classId, classId));

	// Get assessment types
	const assessmentTypes = await db
		.select()
		.from(assessmentType)
		.where(eq(assessmentType.isActive, true));
	const typeWeightMap = new Map(assessmentTypes.map((t) => [t.code, t.defaultWeight || 0]));

	// Get all scores for students in this rombel
	const studentIds = studentsInRombel.map((s) => s.studentId);
	const classSubjectIds = subjects.map((s) => s.classSubjectId);

	let allScores = [];
	if (studentIds.length > 0 && classSubjectIds.length > 0) {
		allScores = await db
			.select({
				studentId: studentScores.studentId,
				classSubjectId: studentScores.classSubjectId,
				assessmentCode: assessmentType.code,
				score: studentScores.score
			})
			.from(studentScores)
			.innerJoin(assessmentType, eq(studentScores.assessmentTypeId, assessmentType.id))
			.where(
				and(
					inArray(studentScores.studentId, studentIds),
					inArray(studentScores.classSubjectId, classSubjectIds)
				)
			);
	}

	// Build student score matrix
	const students = studentsInRombel.map((student) => {
		const studentScoresData = allScores.filter((s) => s.studentId === student.studentId);

		// Group by subject
		const subjectScores = subjects.map((subject) => {
			const scoresForSubject = studentScoresData.filter(
				(s) => s.classSubjectId === subject.classSubjectId
			);
			const scores = {};
			scoresForSubject.forEach((s) => {
				scores[s.assessmentCode] = s.score;
			});
			const { total, average, weightedAverage } = calculateScoreTotals(scores, typeWeightMap);
			return {
				subjectId: subject.subjectId,
				subjectName: subject.subjectName,
				scores,
				total,
				average,
				weightedAverage
			};
		});

		// Calculate overall average across all subjects
		const allAverages = subjectScores.filter((s) => s.average > 0).map((s) => s.weightedAverage);
		const overallAverage =
			allAverages.length > 0
				? Math.round((allAverages.reduce((a, b) => a + b, 0) / allAverages.length) * 100) / 100
				: 0;

		return {
			studentId: student.studentId,
			nisn: student.nisn,
			studentName: student.studentName,
			subjectScores,
			overallAverage
		};
	});

	return {
		rombelName,
		subjects: subjects.map((s) => ({ id: s.subjectId, name: s.subjectName })),
		assessmentTypes,
		students
	};
};

/**
 * Reads a "pivoted" Excel file (subjects as columns) and saves all scores.
 * @param {Buffer} fileBuffer
 * @param {number} classId
 * @param {number} assessmentTypeId
 * @returns {Promise<{successCount: number, errors: Array<{row: number, nisn: string, error: string}>}>}
 **/

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

/**
 * Saves bulk scores for a specific classSubject and assessmentType.
 * Uses UPSERT to update existing scores or insert new ones.
 * @param {number} classSubjectId
 * @param {number} assessmentTypeId
 * @param {Array<{studentId: number, score: number}>} scores
 */
export const saveBulkScores = async (classSubjectId, assessmentTypeId, scores) => {
	if (!scores || scores.length === 0) {
		return { successCount: 0, errors: [] };
	}

	const errors = [];
	const validScores = [];

	// Validate scores
	for (const item of scores) {
		if (!item.studentId || item.score === undefined || item.score === null) {
			errors.push({ studentId: item.studentId, error: 'Missing studentId or score' });
			continue;
		}

		const score = parseFloat(item.score);
		if (isNaN(score) || score < 0 || score > 100) {
			errors.push({ studentId: item.studentId, error: 'Score must be between 0 and 100' });
			continue;
		}

		validScores.push({
			studentId: item.studentId,
			classSubjectId,
			assessmentTypeId,
			score,
			assessmentDate: new Date().toISOString().split('T')[0]
		});
	}

	if (validScores.length > 0) {
		await db
			.insert(studentScores)
			.values(validScores)
			.onConflictDoUpdate({
				target: [
					studentScores.studentId,
					studentScores.classSubjectId,
					studentScores.assessmentTypeId
				],
				set: {
					score: sql`excluded.score`,
					assessmentDate: sql`excluded.assessment_date`
				}
			});
	}

	return {
		successCount: validScores.length,
		errors
	};
};

/**
 * Uploads scores from a simple Excel file (ID Siswa, NISN, Nama, Score columns).
 * The template is generated by generateScoreTemplateForRombel.
 * @param {Buffer} fileBuffer
 * @param {number} classSubjectId
 * @param {number} assessmentTypeId - If 0, upload ALL assessment types from template columns
 * @returns {Promise<{successCount: number, errors: Array}>}
 */
export const uploadScoresFromExcel = async (fileBuffer, classSubjectId, assessmentTypeId) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer);

	const worksheet = workbook.getWorksheet(1);
	if (!worksheet) throw new Error('No worksheet found in the file.');

	const errors = [];
	const scoresToSave = [];

	// Find the header row (row 6 based on our template)
	// Headers: ID Siswa, NISN, Nama Siswa, [Assessment Type Codes...]
	const headerRowIndex = 6;
	const headerRow = worksheet.getRow(headerRowIndex).values; // 1-indexed array

	// If assessmentTypeId === 0, we need to map column headers to assessment type IDs
	let columnToAssessmentMap = new Map(); // Map<columnIndex, assessmentTypeId>

	if (assessmentTypeId === 0) {
		// Fetch all assessment types to match column headers
		const allTypes = await db.select().from(assessmentType);
		const codeToIdMap = new Map(allTypes.map((t) => [t.code.toUpperCase(), t.id]));

		// Map columns 4+ to assessment types based on header
		for (let col = 4; col < headerRow.length; col++) {
			const headerValue = headerRow[col]?.toString().toUpperCase().trim();
			if (headerValue && codeToIdMap.has(headerValue)) {
				columnToAssessmentMap.set(col, codeToIdMap.get(headerValue));
			}
		}

		if (columnToAssessmentMap.size === 0) {
			throw new Error(
				'Tidak ditemukan kolom jenis penilaian yang valid. Pastikan header kolom sesuai dengan kode penilaian (TUGAS, UH, UTS, UAS, dll).'
			);
		}
	}

	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		// Skip rows before data (header is at row 6, data starts at row 7)
		if (rowNumber <= headerRowIndex) return;

		const studentId = row.getCell(1).value; // Column A: ID Siswa
		const nisn = row.getCell(2).value?.toString(); // Column B: NISN

		if (!studentId) {
			// Skip empty rows
			return;
		}

		if (assessmentTypeId === 0) {
			// Upload ALL assessment types - iterate through mapped columns
			for (const [col, typeId] of columnToAssessmentMap) {
				const cellValue = row.getCell(col).value;
				if (cellValue === null || cellValue === undefined || cellValue === '') {
					continue; // Skip empty cells
				}

				const score = parseFloat(cellValue);
				if (isNaN(score)) {
					continue; // Skip non-numeric
				}

				if (score < 0 || score > 100) {
					errors.push({
						row: rowNumber,
						nisn: nisn || 'N/A',
						error: `Score ${score} di kolom ${headerRow[col]} diluar range (0-100)`
					});
					continue;
				}

				scoresToSave.push({
					studentId: parseInt(studentId),
					classSubjectId,
					assessmentTypeId: typeId,
					score,
					assessmentDate: new Date().toISOString().split('T')[0]
				});
			}
		} else {
			// Upload for a SPECIFIC assessment type - take first non-empty score column
			let score = null;
			for (let col = 4; col <= row.cellCount; col++) {
				const cellValue = row.getCell(col).value;
				if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
					const parsed = parseFloat(cellValue);
					if (!isNaN(parsed)) {
						score = parsed;
						break;
					}
				}
			}

			if (score === null) {
				return; // No score found for this row
			}

			if (score < 0 || score > 100) {
				errors.push({
					row: rowNumber,
					nisn: nisn || 'N/A',
					error: `Score ${score} is out of range (0-100)`
				});
				return;
			}

			scoresToSave.push({
				studentId: parseInt(studentId),
				classSubjectId,
				assessmentTypeId,
				score,
				assessmentDate: new Date().toISOString().split('T')[0]
			});
		}
	});

	if (scoresToSave.length > 0) {
		await db
			.insert(studentScores)
			.values(scoresToSave)
			.onConflictDoUpdate({
				target: [
					studentScores.studentId,
					studentScores.classSubjectId,
					studentScores.assessmentTypeId
				],
				set: {
					score: sql`excluded.score`,
					assessmentDate: sql`excluded.assessment_date`
				}
			});
	}

	return {
		successCount: scoresToSave.length,
		errors
	};
};
