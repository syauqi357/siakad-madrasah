import { db } from '../src/index.js';
import { classes } from '../src/db/schema/classesDataTable.js';
import { academicYear } from '../src/db/schema/academicYear.js';
import { eq } from 'drizzle-orm';


//explained in classdatadocumentation.md

// input academic year
export const academicYearAcceptance = async (data) => {
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
};

// input class data
export const inputClassData = async (data) => {
	const [newClass] = await db
		.insert(classes)
		.values({
			className: data.className
		})
		.returning();

	return newClass;
};

// edit class data
export const editClassData = async (id, data) => {
	const [updatedClass] = await db
		.update(classes)
		.set({
			className: data.className
		})
		.where(eq(classes.id, id))
		.returning();

	return updatedClass || null;
};

// get class data to show it as a dropdown or card view
export const getClassData = async () => {
	return await db.select().from(classes);
};

// delete class data
export const deleteClassData = async (id) => {
	const [deletedClass] = await db.delete(classes).where(eq(classes.id, id)).returning();

	return deletedClass || null;
};
