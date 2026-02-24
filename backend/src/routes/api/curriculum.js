import express from 'express';
import {
	getAll,
	getLite,
	getActive,
	getById,
	create,
	update,
	remove
} from '../../controllers/curriculumController.js';

const router = express.Router();

// GET /curriculum - Get all curricula
router.get('/', getAll);

// GET /curriculum/lite - For dropdowns
router.get('/lite', getLite);

// GET /curriculum/active - Get active curriculum
router.get('/active', getActive);

// GET /curriculum/:id - Get single
router.get('/:id', getById);

// POST /curriculum - Create new
router.post('/', create);

// PUT /curriculum/:id - Update
router.put('/:id', update);

// DELETE /curriculum/:id - Delete
router.delete('/:id', remove);

export default router;
