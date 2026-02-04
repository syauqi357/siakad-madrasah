import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const curriculum = sqliteTable('curriculum', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	code: text('code').notNull().unique(),
	year: text('year').notNull(),
	description: text('description'),
	isActive: integer('is_active').default(0)
});
