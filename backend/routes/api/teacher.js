import express from 'express';
import { getTeachersList } from '../../controllers/teacherController.js';

const router = express.Router();

// GET /api/teachers/list
router.get('/list', getTeachersList);

export default router;
