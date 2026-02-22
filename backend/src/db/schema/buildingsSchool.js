// Buildings & Fixed Assets Schema (Aset Tetap Sekolah)
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

/**
 * Table untuk menyimpan data aset tetap sekolah
 *
 * categoryId mapping (sesuai frontend):
 *   1 - Tanah dan Bangunan
 *   2 - Peralatan Elektronik & Teknologi (TIK)
 *   3 - Mebel (Furniture)
 *   4 - Peralatan Laboratorium & Praktik
 *   5 - Kendaraan Operasional
 *   6 - Aset Tetap Lainnya
 *
 * condition: 'baik' | 'rusak_ringan' | 'rusak_berat'
 * status: 'aktif' | 'tidak_aktif' | 'dihapuskan'
 */
export const buildingsSchoolTable = sqliteTable('buildings_school', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	categoryId: int().notNull(),
	subcategory: text().notNull(),
	condition: text().default('baik'),
	quantity: int().default(1),
	acquisitionYear: int(),
	acquisitionValue: int(),
	location: text(),
	registrationNumber: text(),
	brand: text(), // merek (untuk elektronik/TIK)
	model: text(), // model/tipe
	serialNumber: text(), // nomor seri
	specifications: text(), // spesifikasi teknis (RAM, CPU, dll)
	description: text(),
	status: text().default('aktif'),
	createdAt: int().default(Date.now()),
	updatedAt: int().default(Date.now())
});

/*
 * Contoh data:
 *
 * {
 *   "id": 1,
 *   "name": "Gedung Utama Lantai 1",
 *   "categoryId": 1,
 *   "subcategory": "Gedung Ruang Kelas",
 *   "condition": "baik",
 *   "quantity": 1,
 *   "acquisitionYear": 2015,
 *   "acquisitionValue": 500000000,
 *   "location": "Blok A",
 *   "registrationNumber": "INV-BNG-001",
 *   "description": "Gedung kelas utama 6 ruangan",
 *   "status": "aktif",
 *   "createdAt": 1706234567890,
 *   "updatedAt": 1706234567890
 * }
 *
 * {
 *   "id": 2,
 *   "name": "Laptop HP ProBook 450",
 *   "categoryId": 2,
 *   "subcategory": "Komputer & Laptop",
 *   "condition": "baik",
 *   "quantity": 20,
 *   "acquisitionYear": 2023,
 *   "acquisitionValue": 12000000,
 *   "location": "Lab Komputer",
 *   "registrationNumber": "INV-TIK-015",
 *   "description": "Laptop untuk lab komputer siswa",
 *   "status": "aktif",
 *   "createdAt": 1706234567890,
 *   "updatedAt": 1706234567890
 * }
 */