import express from 'express';
import multer from 'multer';
import {
	getScores,
	saveScores,
	uploadScores,
	uploadBulkPivotScores,
	getClassSubjects,
	getSubjects,
	downloadScoreTemplateForRombel
} from '../../controllers/scoreController.js';

const router = express.Router();

// Configure Multer (Memory Storage is fine for small Excel files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Template Download ---
// GET /routes/api/score/template/:rombelId
router.get('/template/:rombelId', downloadScoreTemplateForRombel);

// GET /routes/api/score/subjects/:rombelId - Get subjects for simple selector
router.get('/subjects/:rombelId', getSubjects);

// --- Data Routes ---
router.get('/class-subjects', getClassSubjects);
router.get('/scorebyclass', getScores);
router.post('/scores', saveScores);

// --- Upload Routes ---
router.post('/upload', upload.single('file'), uploadScores);
router.post('/upload-bulk', upload.single('file'), uploadBulkPivotScores);

export default router;
