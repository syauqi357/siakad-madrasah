// controllers/studentController.js
import * as studentService from '../services/student.service.js';

// Controller to get all student data
export const getAllStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;

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

// Controller to get lite student data (for dropdowns/lists)
export const getStudentsLite = async (req, res) => {
	try {
		const students = await studentService.findAllStudentsLite();
		res.status(200).json(students);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student list', error: error.message });
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

		// Handle BigInt serialization
		const serializedStudent = JSON.parse(
			JSON.stringify(student, (key, value) =>
				typeof value === 'bigint' ? value.toString() : value
			)
		);

		res.status(200).json(serializedStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student data', error: error.message });
	}
};

export const createStudent = async (req, res) => {
	try {
		const newStudent = await studentService.createStudentData(req.body);

		// Handle BigInt serialization (better-sqlite3 may return BigInt for IDs)
		const serializedStudent = JSON.parse(
			JSON.stringify(newStudent, (key, value) =>
				typeof value === 'bigint' ? value.toString() : value
			)
		);

		res.status(201).json(serializedStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error creating student', error: error.message });
	}
};

export const createBulkStudent = async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).json({ message: 'No file uploaded.' });
		}
		const newBulkStudent = await studentService.createBulkStudentsFromExcel(file.buffer);
		res.status(201).json({ message: 'Bulk student upload successful', data: newBulkStudent });
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error uploading student', error: error.message });
	}
};

export const downloadStudentBulkTemplate = async (req, res) => {
	try {
		const workbook = await studentService.createStudentdataInputExcelBulkGenerator();

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader('Content-Disposition', 'attachment; filename="bulk_student_template.xlsx"');

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error('Error generating student bulk template:', error);
		res.status(500).json({ message: 'Error generating template', error: error.message });
	}
};

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
