import express from 'express';
import { getSchoolData, createSchoolData, updateSchoolData } from '../../controllers/schoolController.js';

const router = express.Router();

router.get('/', getSchoolData);
router.post('/', createSchoolData);
router.put('/', updateSchoolData);

export default router;
