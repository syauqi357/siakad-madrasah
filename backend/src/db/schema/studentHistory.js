import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { studentTable } from './studentsdataTable.js';
import { rombel } from './classGroup.js';

export const studentHistory = sqliteTable('student_history', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	studentId: integer('student_id')
		.notNull()
		.references(() => studentTable.id),
	rombelId: integer('rombel_id').references(() => rombel.id),
	// Store scores as JSON text (SQLite doesn't have native JSON type)
	scores: text('scores'),
	// Status type: MUTASI (dropout/transferred) or GRADUATE
	statusType: text('status_type', { enum: ['MUTASI', 'GRADUATE'] }).notNull(),
	// Reason for leaving (required for MUTASI, optional for GRADUATE)
	reason: text('reason'),
	// MUTASI specific fields
	mutasiType: text('mutasi_type'), // pindah_sekolah, keluar, dikeluarkan, etc.
	destinationSchool: text('destination_school'), // Next school name for transfers
	// Date when student completed/left
	completionDate: text('completion_date').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});