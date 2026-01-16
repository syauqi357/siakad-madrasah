import { db } from '../src/index.js';
import { studentScores } from '../src/db/schema/studentScore.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { assessmentType } from '../src/db/schema/assesmentType.js';
import { eq, sql } from 'drizzle-orm';

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
