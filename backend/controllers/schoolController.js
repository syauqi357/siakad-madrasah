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
	const uploadPath = path.join(__dirname, '../public/upload/profilesch');

	try {
		const files = fs.readdirSync(uploadPath);
		const logoFile = files.find((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file));
		return logoFile ? path.posix.join('/upload/profilesch', logoFile) : '';
	} catch (error) {
		console.error('Error reading upload directory:', error);
		return '';
	}
}

// function to get facility 
// Helper function with safe array access
function findFacilityImages(facilityType, subFolder = null) {
	const basePath = path.join(__dirname, '../public/upload/imageSch');
	const uploadPath = subFolder 
		? path.join(basePath, facilityType, subFolder)
		: path.join(basePath, facilityType);

	try {
		// Check if directory exists first
		if (!fs.existsSync(uploadPath)) {
			console.log(`Directory doesn't exist: ${uploadPath}`);
			return [];
		}

		const files = fs.readdirSync(uploadPath);
		const imageFiles = files
			.filter((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file))
			.map((file) => {
				const basePathUrl = '/upload/imageSch';
				const imagePath = subFolder ? path.posix.join(basePathUrl, facilityType, subFolder, file) : path.posix.join(basePathUrl, facilityType, file);
				return imagePath;
			})
			.slice(0, 4); // Limit to max 4 images
		
		return imageFiles;
	} catch (error) {
		console.error(`Error reading ${facilityType} directory:`, error);
		return []; // Return empty array on error
	}
}

// Controller with safe handling
export const getFacilityImages = (req, res) => {
	try {
		const facilities = {
			aset: findFacilityImages('aset'),
			asrama: findFacilityImages('asrama'),
			canteen: findFacilityImages('canteen'),
			certification: findFacilityImages('certification'),
			gedung: findFacilityImages('gedung'),
			kamar_mandi: findFacilityImages('kamar_mandi'),
			kantor: findFacilityImages('kantor'),
			kelas: findFacilityImages('kelas'),
			lab: {
				lab_Ipa: findFacilityImages('lab', 'lab_Ipa'),
				lab_komputer: findFacilityImages('lab', 'lab_komputer'),
				lab_multimedia: findFacilityImages('lab', 'lab_multimedia')
			},
			lapangan: findFacilityImages('lapangan'),
			masjid: findFacilityImages('masjid'),
			parking_lot: findFacilityImages('parking_lot')
		};

		res.json(facilities);
	} catch (error) {
		console.error('Error in getFacilityImages:', error);
		res.status(500).json({ 
			error: 'Failed to fetch facility images',
			facilities: {} // Return empty object as fallback
		});
	}
};

// Controller function
export const getSchoolData = (req, res) => {
	try {
		const schoolData = {
			...schoolDataBase,
			logoUrl: findLogoFile(),
			// Merge facility images into the main data response
			aset: findFacilityImages('aset'),
			asrama: findFacilityImages('asrama'),
			canteen: findFacilityImages('canteen'),
			certification: findFacilityImages('certification'),
			gedung: findFacilityImages('gedung'),
			kamar_mandi: findFacilityImages('kamar_mandi'),
			kantor: findFacilityImages('kantor'),
			kelas: findFacilityImages('kelas'),
			lab: {
				lab_Ipa: findFacilityImages('lab', 'lab_Ipa'),
				lab_komputer: findFacilityImages('lab', 'lab_komputer'),
				lab_multimedia: findFacilityImages('lab', 'lab_multimedia')
			},
			lapangan: findFacilityImages('lapangan'),
			masjid: findFacilityImages('masjid'),
			parking_lot: findFacilityImages('parking_lot')
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