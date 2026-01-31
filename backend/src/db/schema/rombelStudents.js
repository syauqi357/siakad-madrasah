import { sqliteTable, integer, primaryKey, text } from 'drizzle-orm/sqlite-core';
import { rombel } from './classGroup.js';
import { studentTable } from './studentsdataTable.js';

export const rombelStudents = sqliteTable(
	'rombel_students',
	{
		rombelId: integer('rombel_id')
			.notNull()
			.references(() => rombel.id),
		studentId: integer('student_id')
			.notNull()
			.references(() => studentTable.id),
		// Track if student is still active in this rombel
		isActive: integer('is_active', { mode: 'boolean' }).default(true),
		// Timestamp when student left this rombel (MUTASI/GRADUATE)
		leftAt: text('left_at')
	},
	(t) => ({
		pk: primaryKey(t.rombelId, t.studentId)
	})
);
