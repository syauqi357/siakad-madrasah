import { integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';
import { SubjectTable } from './subjectTable.js';
import { teacher } from './teacherUser.js';
import { classesTable } from './classesDataTable.js';

export const classSubject = sqliteTable(
	'class_subject',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		classId: integer('class_id')
			.notNull()
			.references(() => classesTable.id, { onDelete: 'cascade' }),
		subjectId: integer('subject_id')
			.notNull()
			.references(() => SubjectTable.id),
		teacherId: integer('teacher_id').references(() => teacher.id)
	},
	(table) => ({
		// Composite unique constraint
		unq: unique().on(table.classId, table.subjectId)
	})
);
