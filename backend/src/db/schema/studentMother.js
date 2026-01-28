import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { studentTable } from './studentsdataTable.js';

export const studentMother = sqliteTable('student_mother', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	studentId: integer('student_id')
		.notNull()
		.unique()
		.references(() => studentTable.id, {
			onDelete: 'cascade'
		}),

	nik: text('nik'),
	name: text('name'),
	birthPlace: text('birth_place'),
	birthDate: text('birth_date'), // SQLite DATE = TEXT
	birthYear: integer('birth_year'),

	education: text('education'),
	occupation: text('occupation'),
	monthlyIncome: real('monthly_income'), // DECIMAL → REAL (SQLite)

	phoneNumber: text('phone_number'),
	isAlive: integer('is_alive').default(1) // BOOLEAN → INTEGER (0/1)
});
