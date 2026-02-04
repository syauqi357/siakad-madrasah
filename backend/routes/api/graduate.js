import express from 'express';
import {
	getGraduates,
	getGraduateStats,
	getGraduationYears,
	getGraduateById,
	graduateStudent,
	bulkGraduateStudents,
	updateGraduate
} from '../../controllers/graduateController.js';

const router = express.Router();

// GET /graduates - List all alumni with pagination
// Query params: page, limit, year
router.get('/', getGraduates);

// GET /graduates/stats - Get alumni statistics (total, by year)
router.get('/stats', getGraduateStats);

// GET /graduates/years - Get distinct graduation years for dropdown
router.get('/years', getGraduationYears);

// POST /graduates/bulk - Bulk graduate multiple students (MUST be before /:id)
// Body: { students: [...], commonData: { completionDate, graduationYear } }
router.post('/bulk', bulkGraduateStudents);

// GET /graduates/:id - Get single alumni detail
router.get('/:id', getGraduateById);

// POST /graduates/:id - Graduate a student
// Body: { completionDate, graduationYear, certificateNumber?, finalGrade?, scores? }
router.post('/:id', graduateStudent);

// PUT /graduates/:id - Update alumni data
router.put('/:id', updateGraduate);

export default router;
