import express from 'express';
import multer from 'multer';
import {
	getAllStudents,
	getStudentById,
	createStudent,
	updateStudent,
	deleteStudent,
	getStudentCount,
	createBulkStudent,
	downloadStudentBulkTemplate
} from '../../controllers/studentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Student Data Routes ---
router.get('/studentDataSet', getAllStudents);
router.get('/studentDataSet/count', getStudentCount);
router.get('/studentDataSet/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// --- Bulk Operations ---
router.post('/students/upload-bulk', upload.single('file'), createBulkStudent);
router.get('/students/download-template', downloadStudentBulkTemplate);

export default router;
