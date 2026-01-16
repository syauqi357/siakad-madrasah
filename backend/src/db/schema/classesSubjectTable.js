import { integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';
import { Subjects } from './subjectTable.js';
import { teachers } from './teacherUser.js';
import { classes } from './classesDataTable.js';

export const classSubject = sqliteTable(
	'class_subject',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		classId: integer('class_id')
			.notNull()
			.references(() => classes.id, { onDelete: 'cascade' }),
		subjectId: integer('subject_id')
			.notNull()
			.references(() => Subjects.id),
		teacherId: integer('teacher_id').references(() => teachers.id)
	},
	(table) => ({
		// Composite unique constraint
		// unq: unique().on(table.classId, table.subjectId)
	})
);
