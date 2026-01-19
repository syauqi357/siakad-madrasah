/**
 *
 * class data services is a service layer logic to create read edit delete the class data
 * its related to schema in backend/src/db/schema/classesDataTable.js
 *
 * the schema :
 * import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
 * import { academicYear } from './academicYear.js';
 * import { teachers } from './teacherUser.js';
 *
 * export const classes = sqliteTable('classes', {
 * 	id: integer('id').primaryKey({ autoIncrement: true }),
 * 	className: text('class_name').notNull() // X, XI, XII
 * });
 *
 * class data is used too with academic year  and related to this schema drizzle :
 * backend/src/db/schema/academicYear.js
 * its looks like this :
 *
 * import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
 *
 * export const academicYear = sqliteTable('academic_year', {
 * 	id: integer('id').primaryKey({ autoIncrement: true }),
 *
 * 	name: text('name').notNull().unique(),
 *
 * 	startYear: integer('start_year'),
 * 	endYear: integer('end_year'),
 *
 * 	startDate: text('start_date'), // SQLite DATE = TEXT
 * 	endDate: text('end_date'),
 *
 * 	isActive: integer('is_active').default(0) // BOOLEAN → INTEGER (0/1)
 * });
 *
 * */

// input academic year
export const academicYearAcceptance = async () => {

};

// input class data
export const inputClassData = async () => {

};

// edit class data
export const editClassData = async () => {

};

// get class data to show it as a dropdown or card view
export const getClassData = async () => {

};

// delete class data
export const deleteClassData = async () => {

};

