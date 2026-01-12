import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const studentTable = sqliteTable(
	'student',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		studentName: text('student_name').notNull(),
		nisn: integer('nisn').notNull().unique(),
		localNis: integer('local_nis').unique(),
		gender: text('gender', { enum: ['male', 'female'] }),
		religion: text('religion'),
		birthPlace: text('birth_place'),
		birthDate: text('birth_date'), // SQLite stores dates as text
		previousSchool: text('previous_school'),
		phoneNumber: text('phone_number'),
		childOrder: integer('child_order'), // anak ke-berapa
		siblingsCount: integer('siblings_count'),
		originRegion: text('origin_region'),
		bpjs: text('bpjs'), // health insurance number
		idCardNumber: text('id_card_number'), // KTP
		birthCertificateNumber: text('birth_certificate_number'), // akta
		nationality: text('nationality').default('Indonesia'),
		livingWith: text('living_with'), // tinggal bersama
		transportation: text('transportation'),
		profilePhoto: text('profile_photo'),
		createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
		},
	(table) => ({
		nisnIdx: index('idx_students_nisn').on(table.nisn),
		localNisIdx: index('idx_students_local_nis').on(table.localNis)
	})
);

/*

   "id": 25020001,
   "name": "Ahmad Rizki",
   "class": "XII RPL 1",
   "gender": "Laki-laki",
   "cityOfOrigin": "Jakarta",
   "status": "active",
   "address": "Jalan Merdeka No. 123"

*/
