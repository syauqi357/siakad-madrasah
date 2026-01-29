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

/*
 * ========================================================================
 * ASSESSMENT TYPE ROUTES
 * ========================================================================
 * Base path: /api/assessment-types
 *
 * Endpoints:
 * GET    /                  - Get all assessment types (paginated)
 * GET    /lite              - Get active types for dropdown
 * GET    /stats             - Get statistics
 * GET    /:id               - Get single assessment type
 * POST   /                  - Create new assessment type
 * PUT    /:id               - Update assessment type
 * PATCH  /:id/toggle        - Toggle active status
 * DELETE /:id               - Delete assessment type
 * ========================================================================
 */

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
