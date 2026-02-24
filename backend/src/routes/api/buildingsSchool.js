import express from 'express';
import {
	getAll,
	getById,
	getByCategory,
	getBySubcategory,
	create,
	update,
	remove,
	getFacilities
} from '../../controllers/buildingsSchoolController.js';

const router = express.Router();

// Filter endpoints (before :id to avoid conflicts)
router.get('/category/:categoryId', getByCategory);
router.get('/category/:categoryId/sub/:subcategory', getBySubcategory);

// CRUD endpoints
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/facilities', getFacilities);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;