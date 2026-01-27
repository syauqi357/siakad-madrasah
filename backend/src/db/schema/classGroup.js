import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { academicYear } from './academicYear.js';
import { teachers } from './teacherUser.js';
import { classes } from './classesDataTable.js';

export const rombel = sqliteTable('rombel', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	code: text('code').notNull().unique(),
	name: text('name').notNull(),

	classId: integer('class_id')
		.notNull()
		.references(() => classes.id),

	academicYearId: integer('academic_year_id')
		.notNull()
		.references(() => academicYear.id),

	classAdvisorId: integer('class_advisor_id').references(() => teachers.id),

	studentCapacity: integer('student_capacity').default(30),
	classroom: text('classroom')
});
