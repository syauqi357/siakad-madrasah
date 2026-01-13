import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { studentTable } from './studentsdataTable.js';

export const studentAddress = sqliteTable('studentAddress', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	studentId: integer('student_id')
		.notNull()
		.unique()
		.references(() => studentTable.id, {
			onDelete: 'cascade'
		}),

	province: text('province'),
	regency: text('regency'),
	district: text('district'),
	subDistrict: text('sub_district'),
	village: text('village'),
	hamlet: text('hamlet'),
	street: text('street'),
	houseNumber: text('house_number'),
	rt: text('rt'),
	rw: text('rw'),
	postalCode: text('postal_code')
});
