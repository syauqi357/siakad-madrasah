import express from 'express';
import multer from 'multer';
import {
	getAllStudents,
	getStudentsLite,
	getStudentById,
	createStudent,
	updateStudent,
	deleteStudent,
	getStudentCount,
	createBulkStudent,
	downloadStudentBulkTemplate,
	// Status management
	getActiveStudents,
	getDropoutStudents,
	getGraduatedStudents,
	changeStudentStatus
} from '../../controllers/studentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Student Data Routes ---
router.get('/studentDataSet', getAllStudents);
router.get('/studentDataSet/lite', getStudentsLite); // New endpoint for lite list
router.get('/studentDataSet/count', getStudentCount);
router.get('/studentDataSet/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// --- Bulk Operations ---
router.post('/students/upload-bulk', upload.single('file'), createBulkStudent);
router.get('/students/download-template', downloadStudentBulkTemplate);

// --- Status Management Routes ---
router.get('/students/active', getActiveStudents);
router.get('/students/dropout', getDropoutStudents);
router.get('/students/graduated', getGraduatedStudents);
router.post('/students/:id/status', changeStudentStatus);

export default router;
