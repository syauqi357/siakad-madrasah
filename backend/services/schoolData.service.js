import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { eq } from 'drizzle-orm';
import { db, schoolTable } from '../src/index.js';

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

// Helper function with safe array access
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
		const imageFiles = files
			.filter((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file))
			.map((file) => {
				const basePathUrl = '/upload/imageSch';
				const imagePath = subFolder
					? path.posix.join(basePathUrl, facilityType, subFolder, file)
					: path.posix.join(basePathUrl, facilityType, file);
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
	const [schoolData] = await db.select().from(schoolTable).limit(1);
	return schoolData;
};

export const updateSchoolDataInDB = async (id, data) => {
	const [updated] = await db
		.update(schoolTable)
		.set({
			...data,
			logoUrl: findLogoFile()
		})
		.where(eq(schoolTable.id, id))
		.returning();
	return updated;
};

export const createSchoolDataInDB = async (data) => {
	const [school] = await db
		.insert(schoolTable)
		.values({
			...data,
			logoUrl: findLogoFile()
		})
		.returning();
	return school;
};
