import express from 'express';
import {
	getAllClassSubjects,
	getClassSubjectById,
	createClassSubject,
	updateClassSubject,
	deleteClassSubject,
	getClassesDropdown,
	getSubjectsDropdown,
	getTeachersDropdown,
	getUnassignedSubjects
} from '../../controllers/classSubjectController.js';

const router = express.Router();

// Dropdown endpoints (must be before /:id routes)
router.get('/dropdown/classes', getClassesDropdown);
router.get('/dropdown/subjects', getSubjectsDropdown);
router.get('/dropdown/teachers', getTeachersDropdown);
router.get('/unassigned/:classId', getUnassignedSubjects);

// CRUD endpoints
// GET /class-subjects - List all (optional: ?classId=1)
router.get('/', getAllClassSubjects);

// GET /class-subjects/:id - Get single
router.get('/:id', getClassSubjectById);

// POST /class-subjects - Create new assignment
router.post('/', createClassSubject);

// PUT /class-subjects/:id - Update (change teacher)
router.put('/:id', updateClassSubject);

// DELETE /class-subjects/:id - Remove assignment
router.delete('/:id', deleteClassSubject);

export default router;
