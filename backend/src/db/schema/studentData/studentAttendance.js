import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { studentTable } from './studentsdataTable.js';
import { sql } from 'drizzle-orm';

export const studentAttendance = sqliteTable(
	'student_Attendance',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),

		studentId: integer('student_id')
			.notNull()
			.references(() => studentTable.id, {
				onDelete: 'cascade'
			}),

		rombelId: integer('rombel_id')
			.notNull()
			.references(() => rombel.id),

		date: text('date').notNull(), // SQLite DATE = TEXT

		status: text('status').notNull(),

		checkInTime: text('check_in_time'), // SQLite TIME = TEXT
		checkOutTime: text('check_out_time'), // SQLite TIME = TEXT

		note: text('note')
	},
	(table) => ({
		// UNIQUE (student_id, rombel_id, date)
		uniqStudentRombelDate: uniqueIndex('uniq_student_attendance').on(
			table.studentId,
			table.rombelId,
			table.date
		),

		// INDEXES
		idxStudent: index('idx_student_attendance_student').on(table.studentId),
		idxDate: index('idx_student_attendance_date').on(table.date),

		// CHECK (status IN (...))
		statusCheck: sql`
      CHECK (${table.status} IN ('hadir', 'sakit', 'izin', 'alpha'))
    `
	})
);
