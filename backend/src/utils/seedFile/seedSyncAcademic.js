import 'dotenv/config';
import { db } from '../../db/index.js';
import { classes } from '../../db/schema/classesDataTable.js';
import { Subjects } from '../../db/schema/subjectTable.js';
import { classSubject } from '../../db/schema/classesSubjectTable.js';
import { teachers } from '../../db/schema/teacherUser.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { curriculum } from '../../db/schema/curriculum.js';
import { rombel } from '../../db/schema/classGroup.js';
import { eq, sql, and } from 'drizzle-orm';

/**
 * INTELLIGENT SYNC SEED (LEAN VERSION)
 * Strictly assigns teachers to subjects based on their degrees.
 * DOES NOT touch or generate students.
 */
async function intelligentSync() {
	console.log('🚀 Starting Intelligent Academic Synchronization (Teacher-Subject Only)...');

	try {
		// 1. Fetch existing core data
		const existingClasses = await db.select().from(classes).all();
		const existingSubjects = await db.select().from(Subjects).all();
		const existingTeachers = await db.select().from(teachers).all();

		// Fetch Active Curriculum
		const activeCurriculum = await db
			.select()
			.from(curriculum)
			.where(eq(curriculum.isActive, 1))
			.get();

		if (
			existingClasses.length === 0 ||
			existingSubjects.length === 0 ||
			existingTeachers.length === 0
		) {
			console.error(
				'❌ Missing base data! Run seedClasses, seedMapelKurikulum, and seedTeacher first.'
			);
			process.exit(1);
		}

		// 2. Define Category logic
		const categoryDefinitions = {
			RELIGIOUS: {
				subjects: [
					'Al-Quran Hadits',
					'Aqidah Akhlak',
					'Fiqih',
					'Sejarah Kebudayaan Islam',
					'Bahasa Arab'
				],
				degrees: ['S.Ag', 'S.Pd.I', 'Lc', 'M.A.']
			},
			SCIENCE_TECH: {
				subjects: [
					'Matematika',
					'Fisika',
					'Kimia',
					'Biologi',
					'Matematika Peminatan',
					'Prakarya dan Kewirausahaan',
					'komputer'
				],
				degrees: ['S.Si', 'S.Kom', 'S.T', 'M.T.']
			},
			SOCIAL_LANG: {
				subjects: [
					'Bahasa Indonesia',
					'Bahasa Inggris',
					'Sejarah Indonesia',
					'Pendidikan Pancasila dan Kewarganegaraan',
					'Ekonomi',
					'Sosiologi',
					'Geografi',
					'Sejarah',
					'Seni Budaya'
				],
				degrees: ['S.S.', 'S.Pd', 'M.Pd', 'S.E.', 'M.Ak', 'S.Sos']
			}
		};

		const getSubjectCategory = (subjectName) => {
			for (const [cat, data] of Object.entries(categoryDefinitions)) {
				if (data.subjects.some((s) => subjectName.includes(s) || s.includes(subjectName)))
					return cat;
			}
			return 'GENERAL';
		};

		const teacherMatchesCategory = (teacherName, category) => {
			if (category === 'GENERAL') return true;
			const degrees = categoryDefinitions[category]?.degrees || [];
			return degrees.some((degree) => teacherName.includes(degree));
		};

		// 3. Verify Active Academic Year
		let activeYear = await db.select().from(academicYear).where(eq(academicYear.isActive, 1)).get();
		if (!activeYear) {
			console.error('❌ No active Academic Year found! Please create one in the UI or via seed.');
			process.exit(1);
		}

		// 4. Assign Subjects (ClassSubject)
		console.log('\n--- Phase 1: Intelligent Subject Assignment ---');
		let assignmentCount = 0;
		for (const classItem of existingClasses) {
			console.log(`   Processing assignments for class: ${classItem.className}...`);
			for (const subject of existingSubjects) {
				// Find matching pool
				let pool = existingTeachers.filter((t) =>
					teacherMatchesCategory(t.fullName, getSubjectCategory(subject.name))
				);

				// Fallback to all teachers if no specialized pool found
				if (pool.length === 0) pool = existingTeachers;

				const assignedTeacher = pool[Math.floor(Math.random() * pool.length)];

				// Check if already exists
				const exists = await db
					.select()
					.from(classSubject)
					.where(
						and(eq(classSubject.classId, classItem.id), eq(classSubject.subjectId, subject.id))
					)
					.get();

				if (!exists) {
					await db
						.insert(classSubject)
						.values({
							classId: classItem.id,
							subjectId: subject.id,
							teacherId: assignedTeacher.id
						})
						.run();
					assignmentCount++;
				}
			}
		}
		console.log(`✅ Success! Created ${assignmentCount} new Subject-Teacher assignments.`);

		// 5. Safety Patch: Fix Curriculum for existing Rombels
		if (activeCurriculum) {
			await db
				.update(rombel)
				.set({ kurikulum: activeCurriculum.id.toString() })
				.where(sql`kurikulum IS NULL OR kurikulum = ''`)
				.run();
			console.log('✅ Checked and patched Rombel curriculum links.');
		}

		console.log('\n🎉 Sync Complete! Database structure is linked without affecting students.');
	} catch (error) {
		console.error('\n❌ Sync Failed:', error);
	} finally {
		process.exit(0);
	}
}

intelligentSync();
