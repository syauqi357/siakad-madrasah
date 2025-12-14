import express from 'express';
import {
	getAllStudents,
	getStudentById,
	createStudent,
	updateStudent,
	deleteStudent
} from '../../controllers/studentDatacontroller.js';

const router = express.Router();

// @route   GET api/students
// @desc    Get all students
// @access  Public
router.get('/studentData', getAllStudents);
router.get('/studentData/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

export default router;
