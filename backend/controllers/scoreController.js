import * as scoreService from '../services/score.services.js';

/**
 * Downloads a pre-populated Excel template for a specific rombel.
 */
export const downloadScoreTemplateForRombel = async (req, res) => {
	try {
		const { rombelId } = req.params;
		const { subjectId } = req.query; // Get subjectId from query

		if (!rombelId) {
			return res.status(400).json({ success: false, message: 'Rombel ID is required.' });
		}

		/*
			Pass valid subjectId to the service.
			Parsing subjectId to int logic:
			- If provided and valid number > 0, use it.
			- Otherwise pass null.
		*/
		const pSubjectId = subjectId ? parseInt(subjectId) : null;

		const workbook = await scoreService.generateScoreTemplateForRombel(
			parseInt(rombelId),
			pSubjectId
		);

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="template_nilai_rombel_${rombelId}.xlsx"`
		);

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error('Error generating score template:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};

export const getSubjects = async (req, res) => {
	try {
		const { rombelId } = req.params;
		if (!rombelId) {
			return res.status(400).json({ success: false, message: 'Rombel ID is required' });
		}
		const result = await scoreService.getSubjectsForRombel(parseInt(rombelId));
		res.json({ success: true, data: result });
	} catch (error) {
		console.error('Error fetching subjects:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};

export const getClassSubjects = async (req, res) => {
	try {
		const result = await scoreService.getAllClassSubjects();
		res.json({ success: true, data: result });
	} catch (error) {
		console.error('Error fetching class subjects:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const getScores = async (req, res) => {
	try {
		const { classSubjectId } = req.query;

		if (!classSubjectId) {
			return res.status(400).json({ success: false, message: 'classSubjectId is required' });
		}

		// Parse to integer to ensure DB query works correctly
		const result = await scoreService.getScoresByClassSubject(parseInt(classSubjectId));

		res.json({
			success: true,
			className: result.className,
			subjectName: result.subjectName,
			assessmentTypes: result.assessmentTypes,
			data: result.data
		});
	} catch (error) {
		console.error('Error fetching scores:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const saveScores = async (req, res) => {
	try {
		const { classSubjectId, assessmentTypeId, scores } = req.body;

		if (!classSubjectId || !assessmentTypeId || !Array.isArray(scores)) {
			return res.status(400).json({ success: false, message: 'Invalid data provided' });
		}

		await scoreService.saveBulkScores(classSubjectId, assessmentTypeId, scores);

		res.json({ success: true, message: 'Scores saved successfully' });
	} catch (error) {
		console.error('Error saving scores:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const uploadScores = async (req, res) => {
	try {
		const { classSubjectId, assessmentTypeId } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ success: false, message: 'No file uploaded' });
		}
		if (!classSubjectId || !assessmentTypeId) {
			return res
				.status(400)
				.json({ success: false, message: 'classSubjectId and assessmentTypeId are required' });
		}

		const result = await scoreService.uploadScoresFromExcel(
			file.buffer,
			parseInt(classSubjectId),
			parseInt(assessmentTypeId)
		);

		res.json({
			success: true,
			message: `Processed ${result.successCount} scores successfully.`,
			errors: result.errors
		});
	} catch (error) {
		console.error('Error uploading scores:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};

export const uploadBulkPivotScores = async (req, res) => {
	try {
		const { classId, assessmentTypeId } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ success: false, message: 'No file uploaded' });
		}
		if (!classId || !assessmentTypeId) {
			return res
				.status(400)
				.json({ success: false, message: 'classId and assessmentTypeId are required' });
		}

		const result = await scoreService.uploadBulkScoresFromPivotExcel(
			file.buffer,
			parseInt(classId),
			parseInt(assessmentTypeId)
		);

		res.json({
			success: true,
			message: `Processed ${result.successCount} scores successfully.`,
			errors: result.errors
		});
	} catch (error) {
		console.error('Error uploading bulk scores:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};

/**
 * Gets score summary for a specific student across all subjects.
 * GET /routes/api/score/student/:studentId/summary
 */
export const getStudentScoreSummary = async (req, res) => {
	try {
		const { studentId } = req.params;
		const { academicYearId } = req.query;

		if (!studentId) {
			return res.status(400).json({ success: false, message: 'Student ID is required' });
		}

		const result = await scoreService.getStudentScoreSummary(
			parseInt(studentId),
			academicYearId ? parseInt(academicYearId) : null
		);

		res.json({
			success: true,
			data: result
		});
	} catch (error) {
		console.error('Error fetching student score summary:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};

/**
 * Gets complete score report for a rombel.
 * GET /routes/api/score/rombel/:rombelId/report
 */
export const getRombelScoreReport = async (req, res) => {
	try {
		const { rombelId } = req.params;

		if (!rombelId) {
			return res.status(400).json({ success: false, message: 'Rombel ID is required' });
		}

		const result = await scoreService.getRombelScoreReport(parseInt(rombelId));

		res.json({
			success: true,
			...result
		});
	} catch (error) {
		console.error('Error fetching rombel score report:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};
