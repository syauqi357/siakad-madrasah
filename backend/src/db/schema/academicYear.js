import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const academicYear = sqliteTable('academic_year', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	name: text('name').notNull().unique(),

	startYear: integer('start_year'),
	endYear: integer('end_year'),

	startDate: text('start_date'), // SQLite DATE = TEXT
	endDate: text('end_date'),

	isActive: integer('is_active').default(0) // BOOLEAN → INTEGER (0/1)
});