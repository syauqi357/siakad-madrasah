import * as subjectService from '../services/subject.services.js';

/**
 * Get all subjects
 */
export const getAllSubjects = (req, res) => {
	try {
		const subjects = subjectService.getAllSubjects();
		res.status(200).json({
			success: true,
			data: subjects
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch subjects: ' + error.message
		});
	}
};

/**
 * Get subject by ID
 */
export const getSubjectById = (req, res) => {
	try {
		const { id } = req.params;
		const subject = subjectService.getSubjectById(parseInt(id));

		if (!subject) {
			return res.status(404).json({
				success: false,
				message: 'Subject not found'
			});
		}

		res.status(200).json({
			success: true,
			data: subject
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch subject: ' + error.message
		});
	}
};

/**
 * Create a new subject
 */
export const createSubject = (req, res) => {
	try {
		const { name, subjectCode, description, kkm } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: 'Subject name is required'
			});
		}

		const subject = subjectService.createSubject({
			name,
			subjectCode,
			description,
			kkm
		});

		res.status(201).json({
			success: true,
			message: 'Subject created successfully',
			data: subject
		});
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
			return res.status(400).json({
				success: false,
				message: 'Subject name or code already exists'
			});
		}
		res.status(500).json({
			success: false,
			message: 'Failed to create subject: ' + error.message
		});
	}
};

/**
 * Update a subject
 */
export const updateSubject = (req, res) => {
	try {
		const { id } = req.params;
		const { name, subjectCode, description, kkm } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: 'Subject name is required'
			});
		}

		const existingSubject = subjectService.getSubjectById(parseInt(id));
		if (!existingSubject) {
			return res.status(404).json({
				success: false,
				message: 'Subject not found'
			});
		}

		const subject = subjectService.updateSubject(parseInt(id), {
			name,
			subjectCode,
			description,
			kkm
		});

		res.status(200).json({
			success: true,
			message: 'Subject updated successfully',
			data: subject
		});
	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
			return res.status(400).json({
				success: false,
				message: 'Subject name or code already exists'
			});
		}
		res.status(500).json({
			success: false,
			message: 'Failed to update subject: ' + error.message
		});
	}
};

/**
 * Delete a subject
 */
export const deleteSubject = (req, res) => {
	try {
		const { id } = req.params;

		const existingSubject = subjectService.getSubjectById(parseInt(id));
		if (!existingSubject) {
			return res.status(404).json({
				success: false,
				message: 'Subject not found'
			});
		}

		subjectService.deleteSubject(parseInt(id));

		res.status(200).json({
			success: true,
			message: 'Subject deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to delete subject: ' + error.message
		});
	}
};

/**
 * Get subjects count
 */
export const getSubjectsCount = (req, res) => {
	try {
		const count = subjectService.getSubjectsCount();
		res.status(200).json({
			success: true,
			data: { count }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to get subjects count: ' + error.message
		});
	}
};
