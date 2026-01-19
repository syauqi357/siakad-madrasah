import { sqliteTable, text, int, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { classSubject } from './classesSubjectTable.js'; // Import classSubject for the foreign key

export const studentTable = sqliteTable(
	'student',
	{
		id: int('id').primaryKey({ autoIncrement: true }),
		studentName: text('student_name').notNull(),
		nisn: int('nisn').notNull().unique(),
		localNis: int('local_nis').unique(),
		gender: text('gender', { enum: ['laki-laki', 'Perempuan'] }),
		religion: text('religion'),
		birthPlace: text('birth_place'),
		birthDate: text('birth_date'), // SQLite stores dates as text
		previousSchool: text('previous_school'),
		phoneNumber: text('phone_number'),
		childOrder: int('child_order'), // anak ke-berapa
		siblingsCount: int('siblings_count'),
		originRegion: text('origin_region'),
		bpjs: text('bpjs'), // health insurance number
		idCardNumber: text('id_card_number'), // KTP
		birthCertificateNumber: text('birth_certificate_number'), // akta
		nationality: text('nationality').default('Indonesia'),
		livingWith: text('living_with'), // tinggal bersama
		transportation: text('transportation'),
		profilePhoto: text('profile_photo'),
		
		// --- NEW: Link to Rombel (classSubject) ---
		rombelId: int('rombel_id').references(() => classSubject.id), // Optional, can be null if not assigned yet

		createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		nisnIdx: index('idx_students_nisn').on(table.nisn),
		studentNameIdx: index('idx_students_student_name').on(table.studentName),
		localNisIdx: index('idx_students_local_nis').on(table.localNis)
	})
);
