import express from 'express';
import { getSchoolData, createSchoolData, updateSchoolData } from '../../controllers/schoolController.js';

const router = express.Router();

router.get('/schoolData', getSchoolData);
router.post('/schoolData', createSchoolData);
router.put('/schoolData', updateSchoolData);

export default router;
