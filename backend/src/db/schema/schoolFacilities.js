// School Facilities Schema
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

/**
 * Table untuk menyimpan data gambar fasilitas sekolah
 *
 * facilityType: aset, asrama, canteen, certification, gedung,
 *               kamar_mandi, kantor, kelas, lab, lapangan, masjid, parking_lot
 *
 * subFolder: untuk lab saja (lab_Ipa, lab_komputer, lab_multimedia), null untuk lainnya
 */
export const schoolFacilitiesTable = sqliteTable('school_facilities', {
	id: int().primaryKey({ autoIncrement: true }),
	facilityType: text().notNull(), // 'canteen', 'lab', 'kelas', etc.
	subFolder: text(), // 'lab_Ipa', 'lab_komputer', etc. (null for non-lab)
	imagePath: text().notNull(), // '/upload/imageSch/canteen/image1.jpg'
	caption: text(), // optional: deskripsi gambar
	displayOrder: int().default(0), // untuk sorting tampilan
	createdAt: int().default(Date.now()) // timestamp
});

/*
 * Contoh data:
 *
 * {
 *   "id": 1,
 *   "facilityType": "canteen",
 *   "subFolder": null,
 *   "imagePath": "/upload/imageSch/canteen/kantin1.jpg",
 *   "caption": "Kantin utama",
 *   "displayOrder": 0,
 *   "createdAt": 1706234567890
 * }
 *
 * {
 *   "id": 2,
 *   "facilityType": "lab",
 *   "subFolder": "lab_komputer",
 *   "imagePath": "/upload/imageSch/lab/lab_komputer/komputer1.jpg",
 *   "caption": "Lab Komputer",
 *   "displayOrder": 0,
 *   "createdAt": 1706234567890
 * }
 */
