import { db } from '../src/index.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { academicYear } from '../src/db/schema/academicYear.js';
import { eq } from 'drizzle-orm';

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
export const academicYearAcceptance = async (data) => {
	try {
		// If setting this year as active, deactivate all others first
		if (data.isActive) {
			await db.update(academicYear).set({ isActive: 0 });
		}

		const [newYear] = await db
			.insert(academicYear)
			.values({
				name: data.name,
				startYear: data.startYear,
				endYear: data.endYear,
				startDate: data.startDate,
				endDate: data.endDate,
				isActive: data.isActive ? 1 : 0
			})
			.returning();

		return newYear;
	} catch (error) {
		throw new Error(`Failed to create academic year: ${error.message}`);
	}
};

// input class data
export const inputClassData = async (data) => {
	try {
		const [newClass] = await db
			.insert(classes)
			.values({
				className: data.className
			})
			.returning();

		return newClass;
	} catch (error) {
		throw new Error(`Failed to create class: ${error.message}`);
	}
};

// edit class data
export const editClassData = async (id, data) => {
	try {
		const [updatedClass] = await db
			.update(classes)
			.set({
				className: data.className
			})
			.where(eq(classes.id, id))
			.returning();

		if (!updatedClass) {
			throw new Error('Class not found');
		}

		return updatedClass;
	} catch (error) {
		throw new Error(`Failed to update class: ${error.message}`);
	}
};

// get class data to show it as a dropdown or card view
export const getClassData = async () => {
	try {
		const allClasses = await db.select().from(classes);
		return allClasses;
	} catch (error) {
		throw new Error(`Failed to fetch classes: ${error.message}`);
	}
};

// delete class data
export const deleteClassData = async (id) => {
	try {
		const [deletedClass] = await db.delete(classes).where(eq(classes.id, id)).returning();

		if (!deletedClass) {
			throw new Error('Class not found');
		}

		return deletedClass;
	} catch (error) {
		throw new Error(`Failed to delete class: ${error.message}`);
	}
};
