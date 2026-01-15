import { relations } from 'drizzle-orm';
import { teachers } from './teacherUser.js';
import { users } from './user.js';
import { classes } from './classesDataTable.js';
import { academicYear } from './academicYear.js';
import { Subjects } from './subjectTable.js';
import { classSubject } from './classesSubjectTable.js';



export const teachersRelations = relations(teachers, ({ one, many }) => ({
	user: one(users, {
		fields: [teachers.userId],
		references: [users.id]
	}),
	homeroomClasses: many(classes),
	classSubjects: many(classSubject)
}));

export const subjectsRelations = relations(Subjects, ({ many }) => ({
	classSubjects: many(classSubject)
}));

export const academicYearsRelations = relations(academicYear, ({ many }) => ({
	classes: many(classes)
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
	academicYear: one(academicYear, {
		fields: [classes.academicYearId],
		references: [academicYear.id]
	}),
	homeroomTeacher: one(teachers, {
		fields: [classes.homeroomTeacherId],
		references: [teachers.id]
	}),
	classSubjects: many(classSubject)
}));

export const classSubjectsRelations = relations(classSubject, ({ one }) => ({
	class: one(classes, {
		fields: [classSubject.classId],
		references: [classes.id]
	}),
	subject: one(Subjects, {
		fields: [classSubject.subjectId],
		references: [Subjects.id]
	}),
	teacher: one(teachers, {
		fields: [classSubject.teacherId],
		references: [teachers.id]
	})
}));
