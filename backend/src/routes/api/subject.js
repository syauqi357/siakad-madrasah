import express from 'express';
import {
	getAllSubjects,
	getSubjectById,
	createSubject,
	updateSubject,
	deleteSubject,
	getSubjectsCount
} from '../../controllers/subjectController.js';

const router = express.Router();

// GET /api/subjects - Get all subjects
router.get('/', getAllSubjects);

// GET /api/subjects/count - Get subjects count
router.get('/count', getSubjectsCount);

// GET /api/subjects/:id - Get subject by ID
router.get('/:id', getSubjectById);

// POST /api/subjects - Create a new subject
router.post('/', createSubject);

// PUT /api/subjects/:id - Update a subject
router.put('/:id', updateSubject);

// DELETE /api/subjects/:id - Delete a subject
router.delete('/:id', deleteSubject);

export default router;
