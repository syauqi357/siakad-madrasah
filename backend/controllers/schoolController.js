import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load static data (later replace with model)
const schoolDataBase = require('../data/lembaga.json');

// Helper function
function findLogoFile() {
	const uploadPath = path.join(__dirname, '../public/upload');

	try {
		const files = fs.readdirSync(uploadPath);
		const logoFile = files.find((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file));
		return logoFile ? `/upload/${logoFile}` : '';
	} catch (error) {
		console.error('Error reading upload directory:', error);
		return '';
	}
}

// Controller function
export const getSchoolData = (req, res) => {
	try {
		const schoolData = {
			...schoolDataBase,
			logoUrl: findLogoFile()
		};
		
		res.json(schoolData);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch school data' });
	}
};

// Future: Add more controllers
export const updateSchoolData = (req, res) => {
	// TODO: Implement when database is ready
	res.status(501).json({ message: 'Not implemented yet' });
};