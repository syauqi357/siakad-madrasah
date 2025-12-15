import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { eq } from 'drizzle-orm';
import { db } from '../src/index.js';
import { schoolTable } from '../src/db/schema/schooldataTable.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load static data (later replace with model)
// const schoolDataBase = require('../data/lembaga.json');

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

// Helper function with safe array access
function findFacilityImages(facilityType, subFolder = null) {
	const basePath = path.join(__dirname, '../public/upload/imageSch');
	const uploadPath = subFolder
		? path.join(basePath, facilityType, subFolder)
		: path.join(basePath, facilityType);

	try {
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
			.slice(0, 4);

		return imageFiles;
	} catch (error) {
		console.error(`Error reading ${facilityType} directory:`, error);
		return [];
	}
}

// Helper to get facility data structure
function getFacilitiesData() {
	return {
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
}

// Controller for facility images only
export const getFacilityImages = (req, res) => {
	try {
		const facilities = getFacilitiesData();
		res.json(facilities);
	} catch (error) {
		console.error('Error in getFacilityImages:', error);
		res.status(500).json({
			error: 'Failed to fetch facility images',
			facilities: {}
		});
	}
};

// Controller to get school data from DATABASE
export const getSchoolData = async (req, res) => {
	try {
		// Get the single school record from database
		const [schoolData] = await db.select().from(schoolTable).limit(1);

		if (!schoolData) {
			return res.status(404).json({ error: 'School data not found in database' });
		}

		// Merge database data with dynamic file-based data
		const response = {
			...schoolData,
			logoUrl: findLogoFile(), // Override with actual logo file
			...getFacilitiesData() // Add facility images
		};

		res.json(response);
	} catch (error) {
		console.error('Error fetching school data:', error);
		res.status(500).json({ error: 'Failed to fetch school data' });
	}
};

// Update school data (only one record)
export const updateSchoolData = async (req, res) => {
	try {
		const { name, npsn, nsm, akreditasi, alamat, kota, negara } = req.body;

		// Check if school exists
		const [existing] = await db.select().from(schoolTable).limit(1);

		if (!existing) {
			return res.status(404).json({ error: 'School data not found. Please create it first.' });
		}

		// Update the single school record
		const [updated] = await db
			.update(schoolTable)
			.set({
				name,
				npsn,
				nsm,
				akreditasi,
				alamat,
				kota,
				negara,
				logoUrl: findLogoFile() // Auto-update logo
			})
			.where(eq(schoolTable.id, existing.id))
			.returning();

		res.json({
			message: 'School data updated successfully',
			data: updated
		});
	} catch (error) {
		console.error('Error updating school data:', error);
		res.status(500).json({ error: 'Failed to update school data' });
	}
};

// Create school data (only if doesn't exist)
export const createSchoolData = async (req, res) => {
	try {
		const { name, npsn, nsm, akreditasi, alamat, kota, negara } = req.body;

		// Check if school already exists
		const [existing] = await db.select().from(schoolTable).limit(1);

		if (existing) {
			return res.status(400).json({
				error: 'School data already exists. Use PUT /api/school to update.'
			});
		}

		// Create the school record
		const [school] = await db
			.insert(schoolTable)
			.values({
				name,
				npsn,
				nsm,
				akreditasi,
				alamat,
				kota,
				negara,
				logoUrl: findLogoFile()
			})
			.returning();

		res.status(201).json({
			message: 'School data created successfully',
			data: school
		});
	} catch (error) {
		console.error('Error creating school data:', error);
		res.status(500).json({ error: 'Failed to create school data' });
	}
};