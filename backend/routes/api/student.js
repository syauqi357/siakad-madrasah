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
	searchStudents,
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
router.get('/studentDataSet/lite', getStudentsLite);
router.get('/studentDataSet/count', getStudentCount);
router.get('/studentDataSet/search', searchStudents); // Search by name, NISN, or local NIS
router.get('/studentDataSet/:id', getStudentById);

// --- Status Management Routes (MUST be before /students/:id) ---
router.get('/students/active', getActiveStudents);
router.get('/students/dropout', getDropoutStudents);
router.get('/students/graduated', getGraduatedStudents);

// --- Bulk Operations ---
router.post('/students/upload-bulk', upload.single('file'), createBulkStudent);
router.get('/students/download-template', downloadStudentBulkTemplate);

// --- CRUD with :id param (MUST be after static routes) ---
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.post('/students/:id/status', changeStudentStatus);

export default router;
