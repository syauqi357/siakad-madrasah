import * as teacherService from '../services/teacher.services.js';

export const getTeachersList = (req, res) => {
	try {
		const result = teacherService.getAllTeachersLite();
		res.status(200).json({
			success: true,
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch teachers: ' + error.message
		});
	}
};
