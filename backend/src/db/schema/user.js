import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	email: text('email').notNull().unique(),
	role: text('role').notNull(), // 'admin' or 'teacher'
	nama_lengkap: text('nama_lengkap'),
	nip: text('nip'),
	jabatan: text('jabatan')
	// indexing on the id and username and password.
	// indexing used cause frequently used and very important to set up faster data
});
