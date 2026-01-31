import express from 'express';
import {
	createAcademicYear,
	createClass,
	getClasses,
	updateClass,
	deleteClass
} from '../../controllers/classdataController.js';

const router = express.Router();

// --- Academic Year Routes ---
// POST /api/class-data/academic-year
router.post('/academic-year', createAcademicYear);

// --- Class Routes ---
// GET /api/class-data/classes
router.get('/classes', getClasses);

// POST /api/class-data/classes
router.post('/classes', createClass);

// PUT /api/class-data/classes/:id
router.put('/classes/:id', updateClass);

// DELETE /api/class-data/classes/:id
router.delete('/classes/:id', deleteClass);

export default router;
