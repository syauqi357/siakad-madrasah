import express from 'express';
import { getSchoolData, updateSchoolData } from '../../controllers/schoolController.js';

const router = express.Router();

router.get('/schoolData', getSchoolData);
router.put('/schoolData', updateSchoolData);

export default router;
