import express from 'express';
import {
	getTeachersList,
	getTeachers,
	getTeacher,
	getTeacherCount,
	createTeacher,
	updateTeacher,
	deleteTeacher
} from '../../controllers/teacherController.js';

const router = express.Router();

// GET /api/teachers - Get all teachers (full details)
router.get('/', getTeachers);

// GET /api/teachers/count - Get teacher count
router.get('/count', getTeacherCount);

// GET /api/teachers/list - Get lightweight list (id + fullName only)
router.get('/list', getTeachersList);

// GET /api/teachers/:id - Get single teacher
router.get('/:id', getTeacher);

// POST /api/teachers - Create new teacher
router.post('/', createTeacher);

// PUT /api/teachers/:id - Update teacher
router.put('/:id', updateTeacher);

// DELETE /api/teachers/:id - Delete teacher
router.delete('/:id', deleteTeacher);

export default router;
