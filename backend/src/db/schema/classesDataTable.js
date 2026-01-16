import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { academicYear } from './academicYear.js';
import { teachers } from './teacherUser.js';

export const classes = sqliteTable('classes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	className: text('class_name').notNull() // X, XI, XII
});