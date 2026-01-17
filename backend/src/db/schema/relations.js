import { relations } from 'drizzle-orm';
import { teachers } from './teacherUser.js';
import { users } from './user.js';
import { classes } from './classesDataTable.js';
import { academicYear } from './academicYear.js';
import { Subjects } from './subjectTable.js';
import { classSubject } from './classesSubjectTable.js';
import { rombel } from './classGroup.js';

export const teachersRelations = relations(teachers, ({ one, many }) => ({
	user: one(users, {
		fields: [teachers.userId],
		references: [users.id]
	}),
	// A teacher can advise multiple rombels (over years)
	advisedRombels: many(rombel),
	classSubjects: many(classSubject)
}));

export const subjectsRelations = relations(Subjects, ({ many }) => ({
	classSubjects: many(classSubject)
}));

export const academicYearsRelations = relations(academicYear, ({ many }) => ({
	rombels: many(rombel)
}));

export const classesRelations = relations(classes, ({ many }) => ({
	// A Grade Level (e.g. X) has many Rombels (e.g. X-A, X-B)
	rombels: many(rombel),
	// If subjects are assigned per grade level (curriculum), keep this.
	// If assigned per specific class group, move to rombel.
	classSubjects: many(classSubject)
}));

export const rombelRelations = relations(rombel, ({ one }) => ({
	// The generic grade level (e.g. Class X)
	gradeLevel: one(classes, {
		fields: [rombel.classId],
		references: [classes.id]
	}),
	academicYear: one(academicYear, {
		fields: [rombel.academicYearId],
		references: [academicYear.id]
	}),
	classAdvisor: one(teachers, {
		fields: [rombel.classAdvisorId],
		references: [teachers.id]
	})
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
