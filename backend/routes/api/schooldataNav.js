import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getSchoolData, createSchoolData, updateSchoolData, uploadSchoolLogo } from '../../controllers/schoolController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for logo upload
const logoStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../../public/upload/profilesch');
		// Create directory if it doesn't exist
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		// Delete existing logo files first
		const uploadPath = path.join(__dirname, '../../public/upload/profilesch');
		if (fs.existsSync(uploadPath)) {
			const files = fs.readdirSync(uploadPath);
			files.forEach(f => {
				if (/\.(svg|png|jpg|jpeg|gif|webp)$/i.test(f)) {
					fs.unlinkSync(path.join(uploadPath, f));
				}
			});
		}
		// Use 'logo' + original extension
		const ext = path.extname(file.originalname).toLowerCase();
		cb(null, `logo${ext}`);
	}
});

const logoUpload = multer({
	storage: logoStorage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'image/svg+xml';
		if (extname && mimetype) {
			cb(null, true);
		} else {
			cb(new Error('Only image files are allowed (jpg, png, gif, svg, webp)'));
		}
	}
});

router.get('/', getSchoolData);
router.post('/', createSchoolData);
router.put('/', updateSchoolData);
router.post('/logo', logoUpload.single('logo'), uploadSchoolLogo);

export default router;
