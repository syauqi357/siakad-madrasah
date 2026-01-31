import * as teacherService from '../services/teacher.services.js';

// GET /api/teachers/list - Lightweight list (id + fullName only)
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

// GET /api/teachers - Get all teachers with full details
export const getTeachers = (req, res) => {
	try {
		const result = teacherService.getAllTeachers();
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

// GET /api/teachers/:id - Get single teacher by ID
export const getTeacher = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = teacherService.getTeacherById(id);

		if (!result) {
			return res.status(404).json({
				success: false,
				message: 'Teacher not found'
			});
		}

		res.status(200).json({
			success: true,
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch teacher: ' + error.message
		});
	}
};

// POST /api/teachers - Create new teacher
export const createTeacher = (req, res) => {
	try {
		const { fullName } = req.body;

		if (!fullName || !fullName.trim()) {
			return res.status(400).json({
				success: false,
				message: 'Full name is required'
			});
		}

		const result = teacherService.createTeacher(req.body);
		res.status(201).json({
			success: true,
			message: 'Teacher created successfully',
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to create teacher: ' + error.message
		});
	}
};

// PUT /api/teachers/:id - Update teacher
export const updateTeacher = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = teacherService.updateTeacher(id, req.body);

		res.status(200).json({
			success: true,
			message: 'Teacher updated successfully',
			data: result
		});
	} catch (error) {
		const status = error.message === 'Teacher not found' ? 404 : 500;
		res.status(status).json({
			success: false,
			message: error.message
		});
	}
};

// DELETE /api/teachers/:id - Delete teacher
export const deleteTeacher = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = teacherService.deleteTeacher(id);

		res.status(200).json({
			success: true,
			message: 'Teacher deleted successfully',
			data: result
		});
	} catch (error) {
		const status = error.message === 'Teacher not found' ? 404 : 500;
		res.status(status).json({
			success: false,
			message: error.message
		});
	}
};
