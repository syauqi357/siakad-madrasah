import express from 'express';
import {
	getAllAssessmentTypes,
	getAssessmentTypesLite,
	getAssessmentTypeStats,
	getAssessmentTypeById,
	createAssessmentType,
	updateAssessmentType,
	toggleAssessmentTypeStatus,
	deleteAssessmentType
} from '../../controllers/assessmentController.js';

const router = express.Router();

// Static routes first (before :id param route)
router.get('/lite', getAssessmentTypesLite);
router.get('/stats', getAssessmentTypeStats);

// CRUD routes
router.get('/', getAllAssessmentTypes);
router.get('/:id', getAssessmentTypeById);
router.post('/', createAssessmentType);
router.put('/:id', updateAssessmentType);
router.patch('/:id/toggle', toggleAssessmentTypeStatus);
router.delete('/:id', deleteAssessmentType);

export default router;
