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
		// scores: [{ studentId: 1, score: 85 }, { studentId: 2, score: 90 }]

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
			return res.status(400).json({ success: false, message: 'classSubjectId and assessmentTypeId are required' });
		}

		const result = await scoreService.uploadScoresFromExcel(file.buffer, parseInt(classSubjectId), parseInt(assessmentTypeId));

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
