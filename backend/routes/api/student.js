import express from 'express';
import { getAllStudents } from '../../controllers/studentDataController.js';

const router = express.Router();

// @route   GET api/students
// @desc    Get all students
// @access  Public
router.get('/studentData', getAllStudents);

export default router;
