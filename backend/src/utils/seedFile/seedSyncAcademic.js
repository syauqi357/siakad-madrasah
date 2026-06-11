import 'dotenv/config';
import { db } from '../../db/index.js';
import { studentTable } from '../../db/schema/studentsdataTable.js';
import { classes } from '../../db/schema/classesDataTable.js';
import { Subjects } from '../../db/schema/subjectTable.js';
import { classSubject } from '../../db/schema/classesSubjectTable.js';
import { teachers } from '../../db/schema/teacherUser.js';
import { users } from '../../db/schema/user.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { rombel } from '../../db/schema/classGroup.js';
import { rombelStudents } from '../../db/schema/rombelStudents.js';
import { eq, sql, and } from 'drizzle-orm';

/**
 * INTELLIGENT SYNC SEED
 * Assigns teachers to subjects based on their degrees (S.Kom, S.Ag, etc.)
 * and randomizes assignments within relevant pools.
 */
async function intelligentSync() {
	console.log('🧠 Starting Intelligent Academic Synchronization...');

	try {
		// 1. Fetch data
		const existingClasses = await db.select().from(classes).all();
		const existingSubjects = await db.select().from(Subjects).all();
		const existingTeachers = await db.select().from(teachers).all();

		if (existingClasses.length === 0 || existingSubjects.length === 0 || existingTeachers.length === 0) {
			console.error('❌ Missing base data! Run seedClasses, seedMapelKurikulum, and seedTeacher first.');
			process.exit(1);
		}

		// 2. Define Category logic
		const categoryDefinitions = {
			RELIGIOUS: {
				subjects: ['Al-Quran Hadits', 'Aqidah Akhlak', 'Fiqih', 'Sejarah Kebudayaan Islam', 'Bahasa Arab'],
				degrees: ['S.Ag', 'S.Pd.I', 'Lc', 'M.A.']
			},
			SCIENCE_TECH: {
				subjects: ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Matematika Peminatan', 'Prakarya dan Kewirausahaan'],
				degrees: ['S.Si', 'S.Kom', 'S.T', 'M.T.']
			},
			SOCIAL_LANG: {
				subjects: ['Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah Indonesia', 'Pendidikan Pancasila dan Kewarganegaraan', 'Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah', 'Seni Budaya'],
				degrees: ['S.S.', 'S.Pd', 'M.Pd', 'S.E.', 'M.Ak', 'S.Sos']
			}
		};

		// Helper to get category for a subject
		const getSubjectCategory = (subjectName) => {
			for (const [cat, data] of Object.entries(categoryDefinitions)) {
				if (data.subjects.some(s => subjectName.includes(s) || s.includes(subjectName))) return cat;
			}
			return 'GENERAL';
		};

		// Helper to check if teacher matches category
		const teacherMatchesCategory = (teacherName, category) => {
			if (category === 'GENERAL') return true;
			const degrees = categoryDefinitions[category]?.degrees || [];
			return degrees.some(degree => teacherName.includes(degree));
		};

		// 3. Ensure Academic Year
		let activeYear = await db.select().from(academicYear).where(eq(academicYear.isActive, 1)).get();
		let academicYearId = activeYear?.id;
		if (!activeYear) {
			const [newYear] = await db.insert(academicYear).values({
				name: '2025/2026 Ganjil',
				startYear: 2025,
				endYear: 2026,
				isActive: 1
			}).returning().all();
			academicYearId = newYear.id;
		}

		// 4. Assign Subjects (The Intelligent Part)
		console.log('\n--- Phase 3: Intelligent Subject Assignment ---');
		let assignmentCount = 0;
		for (const classItem of existingClasses) {
			console.log(`   Assigning for Class ${classItem.className}...`);
			
			for (const subject of existingSubjects) {
				const category = getSubjectCategory(subject.name);
				
				// Find pool of teachers matching the category
				let pool = existingTeachers.filter(t => teacherMatchesCategory(t.fullName, category));
				
				// Fallback if pool is empty
				if (pool.length === 0) pool = existingTeachers;

				// Randomly pick from pool
				const assignedTeacher = pool[Math.floor(Math.random() * pool.length)];

				// Check exists
				const exists = await db.select().from(classSubject).where(and(
					eq(classSubject.classId, classItem.id),
					eq(classSubject.subjectId, subject.id)
				)).get();

				if (!exists) {
					await db.insert(classSubject).values({
						classId: classItem.id,
						subjectId: subject.id,
						teacherId: assignedTeacher.id
					}).run();
					assignmentCount++;
				}
			}
		}
		console.log(`✅ Synced ${assignmentCount} assignments using degree-based matching.`);

		// 5. Create Rombels & Students (Keep this for full functionality)
		console.log('\n--- Phase 4: Rombels & Students ---');
		for (const classItem of existingClasses) {
			const rombelName = `${classItem.className}-A`;
			let currentRombel = await db.select().from(rombel).where(and(
				eq(rombel.name, rombelName),
				eq(rombel.academicYearId, academicYearId)
			)).get();

			let rombelId;
			if (!currentRombel) {
				const advisor = existingTeachers[Math.floor(Math.random() * existingTeachers.length)];
				const [newR] = await db.insert(rombel).values({
					name: rombelName,
					code: `${rombelName.toUpperCase().replace(/\s+/g, '')}-${Date.now()}`,
					classId: classItem.id,
					academicYearId: academicYearId,
					classAdvisorId: advisor.id,
					classroom: `Ruang ${classItem.className}`,
					studentCapacity: 32
				}).returning().all();
				rombelId = newR.id;
				console.log(`✅ Rombel ${rombelName} created with advisor ${advisor.fullName}`);
			} else {
				rombelId = currentRombel.id;
			}

			// Students
			const firstNames = ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gani', 'Hana', 'Indra', 'Joko'];
			const lastNames = ['Saputra', 'Lestari', 'Wijaya', 'Kusuma', 'Pratama', 'Sari', 'Hidayat', 'Putri'];
			
			for (let i = 0; i < 15; i++) {
				const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
				const nisn = `00${academicYearId}${classItem.id}${i}${Math.floor(1000 + Math.random() * 8999)}`;
				
				const existingStudent = await db.select().from(studentTable).where(eq(studentTable.nisn, nisn)).get();
				if (!existingStudent) {
					const [newS] = await db.insert(studentTable).values({
						studentName: fullName,
						nisn: nisn,
						gender: i % 2 === 0 ? 'laki-laki' : 'Perempuan',
						status: 'ACTIVE',
						rombelId: rombelId
					}).returning().all();

					await db.insert(rombelStudents).values({ rombelId, studentId: newS.id, isActive: true }).run();
				}
			}
		}

		console.log('\n🎉 Intelligent Synchronization Complete! Ready for testing.');
	} catch (error) {
		console.error('\n❌ Sync Failed:', error);
	} finally {
		process.exit(0);
	}
}

intelligentSync();
