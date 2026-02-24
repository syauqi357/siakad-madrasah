import express from 'express';
import {
	getRombelsForPromotion,
	getStudentsForPromotion,
	getTargetRombels,
	promoteStudents,
	getAcademicYears,
	getClassLevels
} from '../../controllers/promotionController.js';

const router = express.Router();

// GET /promotion/rombels - Get rombels available for promotion
router.get('/rombels', getRombelsForPromotion);

// GET /promotion/academic-years - Get academic years
router.get('/academic-years', getAcademicYears);

// GET /promotion/class-levels - Get class levels
router.get('/class-levels', getClassLevels);

// GET /promotion/students/:rombelId - Get students from a rombel
router.get('/students/:rombelId', getStudentsForPromotion);

// GET /promotion/targets/:classId - Get target rombels for promotion
router.get('/targets/:classId', getTargetRombels);

// POST /promotion/promote - Promote students to new rombel
router.post('/promote', promoteStudents);

export default router;
