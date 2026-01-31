import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
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
	// Photo upload
	uploadStudentPhoto,
	// Status management
	getActiveStudents,
	getDropoutStudents,
	getGraduatedStudents,
	changeStudentStatus
} from '../../controllers/studentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer for bulk Excel upload (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Multer for student photo upload (disk storage)
const photoStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../../public/upload/Profile/studentProfile'));
	},
	filename: (req, file, cb) => {
		const studentId = req.params.id || 'new';
		const ext = path.extname(file.originalname).toLowerCase();
		cb(null, `student_${studentId}_${Date.now()}${ext}`);
	}
});

const uploadPhoto = multer({
	storage: photoStorage,
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		cb(null, allowed.includes(file.mimetype));
	},
	limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

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
router.post('/students/:id/photo', uploadPhoto.single('photo'), uploadStudentPhoto);

export default router;
