import * as classService from '../services/classData.services.js';

// --- Academic Year Controllers ---

export const createAcademicYear = async (req, res) => {
	try {
		const result = await classService.academicYearAcceptance(req.body);
		res.status(201).json({
			success: true,
			message: 'Academic year created successfully',
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

// --- Class Data Controllers ---

export const createClass = async (req, res) => {
	try {
		const result = await classService.inputClassData(req.body);
		res.status(201).json({
			success: true,
			message: 'Class created successfully',
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

export const getClasses = async (req, res) => {
	try {
		const result = await classService.getClassData();
		res.status(200).json({
			success: true,
			data: result
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

export const updateClass = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await classService.editClassData(id, req.body);
		res.status(200).json({
			success: true,
			message: 'Class updated successfully',
			data: result
		});
	} catch (error) {
		const status = error.message === 'Class not found' ? 404 : 500;
		res.status(status).json({
			success: false,
			message: error.message
		});
	}
};

export const deleteClass = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await classService.deleteClassData(id);
		res.status(200).json({
			success: true,
			message: 'Class deleted successfully',
			data: result
		});
	} catch (error) {
		const status = error.message === 'Class not found' ? 404 : 500;
		res.status(status).json({
			success: false,
			message: error.message
		});
	}
};
