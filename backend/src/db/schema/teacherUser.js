import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './user.js';

export const teachers = sqliteTable('teachers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	nip: text('nip').unique(), // Employee ID Number
	fullName: text('full_name').notNull(),
	gender: text('gender', { enum: ['male', 'female'] }),
	birthPlace: text('birth_place'),
	birthDate: text('birth_date'), // stored as TEXT in SQLite for DATE type
	religion: text('religion'),
	phoneNumber: text('phone_number'),
	personalEmail: text('personal_email'),
	profilePhoto: text('profile_photo')
});
