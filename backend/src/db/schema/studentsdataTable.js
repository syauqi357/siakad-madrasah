import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const studentTable = sqliteTable('student', {
  id: int().primaryKey({ autoIncrement: true }),
  nisn: int().notNull(),
  nis: int().notNull(),
  name: text().notNull(),
  class: text().notNull(),
  gender: text('gender', { enum: ['Laki-laki', 'Perempuan'] }).notNull(),
  cityOfOrigin: text().notNull(),
  status: text('status', {
    enum: ['active', 'nonactive', 'warning', 'alumni']
  }).notNull().default('active'),
  age: int().notNull(),
  address: text().notNull()

  // indexing in id and nisn and name.
  //id nisn and name is used frequently and often be called, for suggestion on the db need to use this column to indexed as well
  
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
