import express from 'express';
import multer from 'multer';
import {
	getScores,
	saveScores,
	uploadScores,
	uploadBulkPivotScores,
	downloadBulkTemplate,
	getClassSubjects
} from '../../controllers/scoreController.js';

const router = express.Router();

// Configure Multer (Memory Storage is fine for small Excel files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /routes/api/score/class-subjects (List all available class subjects)
router.get('/class-subjects', getClassSubjects);

// GET /routes/api/score/scorebyclass?classSubjectId=1
router.get('/scorebyclass', getScores);

// POST /routes/api/score/scores (JSON Bulk Save)
router.post('/scores', saveScores);

// POST /routes/api/score/upload (Single Subject Excel Upload)
// Expects form-data with fields: 'file' (the excel file), 'classSubjectId', 'assessmentTypeId'
router.post('/upload', upload.single('file'), uploadScores);

// POST /routes/api/score/upload-bulk (Multi-Subject "Pivot" Excel Upload)
router.post('/upload-bulk', upload.single('file'), uploadBulkPivotScores);

// GET /routes/api/score/download-template (Download Bulk Excel Template)
router.get('/download-template', downloadBulkTemplate);

export default router;
