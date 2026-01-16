import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const assessmentType = sqliteTable('assessment_type', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	code: text('code').notNull().unique(),
	// contoh: TUGAS, UH, UTS, UAS

	name: text('name').notNull(),
	// contoh: Tugas Harian, Ujian Tengah Semester

	defaultWeight: integer('default_weight'),
	// opsional, bisa null kalau bobot diatur per kelas/mapel

	isActive: integer('is_active', { mode: 'boolean' }).default(true),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});
