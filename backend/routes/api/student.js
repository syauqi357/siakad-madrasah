import express from 'express';
import {
	getAllStudents,
	getStudentById,
	createStudent,
	updateStudent,
	deleteStudent,
	getStudentCount
} from '../../controllers/studentController.js';

const router = express.Router();
// let upload;

// @route   GET api/students
// @desc    Get all students
// @access  Public
router.get('/studentDataSet', getAllStudents);
router.get('/studentDataSet/count', getStudentCount)
router.get('/studentDataSet/:id', getStudentById);
router.post('/students', createStudent);
// router.post('/studentByexcel', upload.single('file'));
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

export default router;
