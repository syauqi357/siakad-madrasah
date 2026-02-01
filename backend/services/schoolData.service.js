import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { and, eq } from 'drizzle-orm';
import { db, schoolDataTable, schoolFacilitiesTable } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to find logo file
export function findLogoFile() {
	const uploadPath = path.join(__dirname, '../public/upload/profilesch');

	try {
		if (!fs.existsSync(uploadPath)) {
			return '';
		}
		const files = fs.readdirSync(uploadPath);
		const logoFile = files.find((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file));
		return logoFile ? path.posix.join('/upload/profilesch', logoFile) : '';
	} catch (error) {
		console.error('Error reading upload directory:', error);
		return '';
	}
}

// Helper function with safe array access (FILESYSTEM-BASED - kept for backward compatibility)
function findFacilityImages(facilityType, subFolder = null) {
	const basePath = path.join(__dirname, '../public/upload/imageSch');
	const uploadPath = subFolder
		? path.join(basePath, facilityType, subFolder)
		: path.join(basePath, facilityType);

	try {
		if (!fs.existsSync(uploadPath)) {
			// console.log(`Directory doesn't exist: ${uploadPath}`);
			return [];
		}

		const files = fs.readdirSync(uploadPath);


		return files
			.filter((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file))
			.map((file) => {
				const basePathUrl = '/upload/imageSch';

				return subFolder
					? path.posix.join(basePathUrl, facilityType, subFolder, file)
					: path.posix.join(basePathUrl, facilityType, file);
			})
			.slice(0, 3); // Max 3 images per facility type
	} catch (error) {
		console.error(`Error reading ${facilityType} directory:`, error);
		return [];
	}
}

// Helper to get facility data structure (FILESYSTEM-BASED - kept for backward compatibility)
export function getFacilitiesData() {
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

export const getSchoolDataFromDB = async () => {
	const [GetschoolData] = await db.select().from(schoolDataTable).limit(1);
	return GetschoolData;
};

export const updateSchoolDataInDB = async (id, data) => {
	const [updatedSchoolData] = await db
		.update(schoolDataTable)
		.set({
			...data,
			logoUrl: findLogoFile()
		})
		.where(eq(schoolDataTable.id, id))
		.returning();
	return updatedSchoolData;
};

export const createSchoolDataInDB = async (data) => {
	const [createSchool] = await db
		.insert(schoolDataTable)
		.values({
			...data,
			logoUrl: findLogoFile()
		})
		.returning();
	return createSchool;
};

// =====================================================
// DATABASE-BASED FACILITY FUNCTIONS (using schema)
// =====================================================

/**
 * Get all facilities from database
 * Returns same JSON format as getFacilitiesData() for compatibility
 */
export const getFacilitiesFromDB = async () => {
	const facilities = await db.select().from(schoolFacilitiesTable);

	// Transform flat array to nested structure (same format as filesystem version)
	const result = {
		aset: [],
		asrama: [],
		canteen: [],
		certification: [],
		gedung: [],
		kamar_mandi: [],
		kantor: [],
		kelas: [],
		lab: {
			lab_Ipa: [],
			lab_komputer: [],
			lab_multimedia: []
		},
		lapangan: [],
		masjid: [],
		parking_lot: []
	};

	for (const facility of facilities) {
		const { facilityType, subFolder, imagePath } = facility;

		if (facilityType === 'lab' && subFolder) {
			if (result.lab[subFolder]) {
				result.lab[subFolder].push(imagePath);
			}
		} else if (result[facilityType]) {
			result[facilityType].push(imagePath);
		}
	}

	return result;
};

/**
 * Get all facilities as flat array (for admin/management)
 */
export const getAllFacilitiesFromDB = async () => {
	return db.select().from(schoolFacilitiesTable);
};

/**
 * Get facilities by type
 * @param {string} facilityType - e.g., 'canteen', 'lab', 'kelas'
 * @param {string|null} subFolder - e.g., 'lab_Ipa' (for lab only)
 */
export const getFacilitiesByType = async (facilityType, subFolder = null) => {
	if (subFolder) {
		return db
			.select()
			.from(schoolFacilitiesTable)
			.where(
				and(
					eq(schoolFacilitiesTable.facilityType, facilityType),
					eq(schoolFacilitiesTable.subFolder, subFolder)
				)
			);
	}
	return db
		.select()
		.from(schoolFacilitiesTable)
		.where(eq(schoolFacilitiesTable.facilityType, facilityType));
};

/**
 * Create a new facility image record
 * @param {Object} data - { facilityType, subFolder?, imagePath, caption?, displayOrder? }
 */
export const createFacilityInDB = async (data) => {
	const [newFacility] = await db
		.insert(schoolFacilitiesTable)
		.values({
			facilityType: data.facilityType,
			subFolder: data.subFolder || null,
			imagePath: data.imagePath,
			caption: data.caption || null,
			displayOrder: data.displayOrder || 0,
			createdAt: Date.now()
		})
		.returning();
	return newFacility;
};

/**
 * Update a facility record
 * @param {number} id - Facility ID
 * @param {Object} data - Fields to update
 */
export const updateFacilityInDB = async (id, data) => {
	const [updatedFacility] = await db
		.update(schoolFacilitiesTable)
		.set(data)
		.where(eq(schoolFacilitiesTable.id, id))
		.returning();
	return updatedFacility;
};

/**
 * Delete a facility record
 * @param {number} id - Facility ID
 */
export const deleteFacilityFromDB = async (id) => {
	const [deletedFacility] = await db
		.delete(schoolFacilitiesTable)
		.where(eq(schoolFacilitiesTable.id, id))
		.returning();
	return deletedFacility;
};
