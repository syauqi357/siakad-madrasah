import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';
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
			.references(() => studentTable.id)
	},
	(t) => ({
		pk: primaryKey(t.rombelId, t.studentId)
	})
);
