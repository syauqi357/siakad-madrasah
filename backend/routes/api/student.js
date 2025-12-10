import express from 'express';
import { getAllStudents, getStudentById } from '../../controllers/studentDatacontroller.js';

const router = express.Router();

// @route   GET api/students
// @desc    Get all students
// @access  Public
router.get('/studentData', getAllStudents);
router.get('/studentData/:id', getStudentById);


export default router;
