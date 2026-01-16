import express from 'express';
import { getScores, saveScores } from '../../controllers/scoreController.js';

const router = express.Router();

// GET /api/scores?classSubjectId=1
router.get('/scorebyclass', getScores);

// POST /api/scores
router.post('/scores', saveScores);

export default router;
