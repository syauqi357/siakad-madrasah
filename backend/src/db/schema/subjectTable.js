import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Subjects = sqliteTable('subjects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	subjectCode: text('subject_code').unique()
});