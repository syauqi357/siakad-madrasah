// controllers/studentController.js
import * as studentService from '../services/student.service.js';

// Controller to get all student data
export const getAllStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		
		const students = await studentService.findAllStudents(page, limit);
		const totalCount = await studentService.countStudents();
		
		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount.count,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student data', error: error.message });
	}
};

// student counter data
export const getStudentCount = async (req, res) => {
	try {
		const result = await studentService.countStudents();
		res.status(200).json(result);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student counts', error: error.message });
	}
};

// controller to get student by id
export const getStudentById = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const student = await studentService.findStudentById(studentId);

		if (!student) {
			return res.status(404).json({ message: `No student found with id ${studentId}` });
		}

		res.status(200).json(student);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student data', error: error.message });
	}
};

export const createStudent = async (req, res) => {
	try {
		const newStudent = await studentService.createStudentData(req.body);
		res.status(201).json(newStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error creating student', error: error.message });
	}
};

export const createBulkStudent = async (req,res) => {
	try {
		const newBulkStudent = await studentService.createStudentData(req.body);
		res.status(201).json(newBulkStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error uploading student', error: error.message });
	}
}

export const updateStudent = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const updated = await studentService.updateStudentData(studentId, req.body);

		if (!updated) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json(updated);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error updating student', error: error.message });
	}
};

export const deleteStudent = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const deleted = await studentService.deleteStudentData(studentId);

		if (!deleted) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({ message: 'Student deleted successfully', student: deleted });
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error deleting student', error: error.message });
	}
};
