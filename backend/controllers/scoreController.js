import * as scoreService from '../services/score.services.js';

export const getScores = async (req, res) => {
	try {
		const { classSubjectId } = req.query;

		if (!classSubjectId) {
			return res.status(400).json({ success: false, message: 'classSubjectId is required' });
		}

		const result = await scoreService.getScoresByClassSubject(classSubjectId);

		res.json({
			success: true,
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

export const downloadBulkTemplate = async (req, res) => {
	try {
		const workbook = await scoreService.generateBulkScoreTemplate();

		// Set headers to instruct the browser to download the file
		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader('Content-Disposition', 'attachment; filename="bulk_score_template.xlsx"');

		// Write the workbook to the response stream
		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error('Error generating template:', error);
		res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
	}
};
