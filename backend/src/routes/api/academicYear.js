import express from 'express';
import {
	getAll,
	getLite,
	getActive,
	getById,
	create,
	update,
	remove
} from '../../controllers/academicYearController.js';

const router = express.Router();

// GET /academic-years - Get all academic years
router.get('/', getAll);

// GET /academic-years/lite - For dropdowns
router.get('/lite', getLite);

// GET /academic-years/active - Get active academic year
router.get('/active', getActive);

// GET /academic-years/:id - Get single
router.get('/:id', getById);

// POST /academic-years - Create new
router.post('/', create);

// PUT /academic-years/:id - Update
router.put('/:id', update);

// DELETE /academic-years/:id - Delete
router.delete('/:id', remove);

export default router;
