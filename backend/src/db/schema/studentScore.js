import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { studentTable } from './studentData/studentsdataTable.js';
import { classSubject } from './classesSubjectTable.js';
import { assessmentType } from './assesmentType.js';

// TODO: Import assessmentType table when created
// import { assessmentType } from './assessmentType.js';

export const studentScores = sqliteTable(
	'student_scores',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),

		studentId: integer('student_id')
			.notNull()
			.references(() => studentTable.id, { onDelete: 'cascade' }),

		classSubjectId: integer('class_subject_id')
			.notNull()
			.references(() => classSubject.id, { onDelete: 'cascade' }),

		// Assuming assessmentType will be a separate table (e.g., UH1, UTS, UAS)
		// If not, you can just make this a text field like: text('assessment_type').notNull()
		assessmentTypeId: integer('assessment_type_id').notNull()
		.references(() => assessmentType.id),

		score: real('score').notNull(),
		// Note: SQLite check constraints are complex in Drizzle.
		// It's easier to validate 0-100 in your API/Service layer.

		assessmentDate: text('assessment_date').default(sql`CURRENT_DATE`),

		note: text('note'),

		createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		// Unique constraint: A student can only have one score for a specific assessment in a specific class
		// e.g. Student A can't have two "UTS" scores for "Math"
		uniqueScore: uniqueIndex('unique_student_assessment').on(
			table.studentId,
			table.classSubjectId,
			table.assessmentTypeId
		)
	})
);
