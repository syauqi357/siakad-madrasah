import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const classes = sqliteTable('classes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	className: text('class_name').notNull() // X, XI, XII
});
