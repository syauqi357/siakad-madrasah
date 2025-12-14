import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('student', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	class : text().notNull(),
   gender: text('gender', { enum: ['male', 'female'] }),
   cityOfOrigin: text().notNull(),
   status: text('status', { 
		enum: ['active', 'nonactive', 'warning', 'alumni'] 
	}).notNull().default('active'),
   age: int().notNull(),
	// email: text().notNull().unique(),
   address:text().notNull()
});

/*

   "id": 25020001,
   "name": "Ahmad Rizki",
   "class": "XII RPL 1",
   "gender": "Laki-laki",
   "cityOfOrigin": "Jakarta",
   "status": "active",
   "address": "Jalan Merdeka No. 123"

*/
