import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { academicYear } from './academicYear.js';
import { teachers } from './teacherUser.js';

export const classes = sqliteTable('classes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	className: text('class_name').notNull(),
	academicYearId: integer('academic_year_id')
		.notNull()
		.references(() => academicYear.id),
	homeroomTeacherId: integer('homeroom_teacher_id').references(() => teachers.id),
	capacity: integer('capacity').default(30)
});