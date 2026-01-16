import express from 'express';
import multer from 'multer';
import { getScores, saveScores, uploadScores } from '../../controllers/scoreController.js';

const router = express.Router();

// Configure Multer (Memory Storage is fine for small Excel files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /routes/api/score/scorebyclass?classSubjectId=1
router.get('/scorebyclass', getScores);

// POST /routes/api/score/scores (JSON Bulk Save)
router.post('/scores', saveScores);

// POST /routes/api/score/upload (Excel File Upload)
// Expects form-data with fields: 'file' (the excel file), 'classSubjectId', 'assessmentTypeId'
router.post('/upload', upload.single('file'), uploadScores);

export default router;
