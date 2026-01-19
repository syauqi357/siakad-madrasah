import express from 'express';
import { createRombel, getRombelList } from '../../controllers/rombelController.js';

const router = express.Router();

// POST /api/rombel - Create a new Rombel
// Assuming this router is mounted at /api
router.post('/rombel', createRombel);

// GET /api/rombel - Get all Rombels
router.get('/rombel', getRombelList);

// GET /api/rombel/:id - Get Rombel details
// router.get('/rombel/:id', getRombelDetail); // Placeholder for future implementation

// PUT /api/rombel/:id - Update Rombel details
// router.put('/rombel/:id', updateRombel); // Placeholder for future implementation

// DELETE /api/rombel/:id - Delete a Rombel
// router.delete('/rombel/:id', deleteRombel); // Placeholder for future implementation

export default router;
