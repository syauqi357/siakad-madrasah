import { db } from '../../db/index.js';
import { studentTable } from '../../db/schema/studentsdataTable.js';
import { classes } from '../../db/schema/classesDataTable.js';
import { Subjects } from '../../db/schema/subjectTable.js';
import { classSubject } from '../../db/schema/classesSubjectTable.js';
import { teachers } from '../../db/schema/teacherUser.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { rombel } from '../../db/schema/classGroup.js';
import { rombelStudents } from '../../db/schema/rombelStudents.js';
import { eq, sql } from 'drizzle-orm';

/**
 * SEED ACADEMIC CORE
 * Generates Rombels, Students, Teachers, and Subject Assignments.
 */
export async function seedAcademicCore() {
	console.log('🌱 Starting Academic Core Seeding...');

	try {
		// 1. Ensure Academic Year exists
		console.log('--- Phase 1: Academic Year ---');
		let activeYear = await db
			.select()
			.from(academicYear)
			.where(eq(academicYear.isActive, 1))
			.limit(1);

		let academicYearId;
		if (activeYear.length === 0) {
			const newYear = await db
				.insert(academicYear)
				.values({
					name: '2025/2026 Ganjil',
					startYear: 2025,
					endYear: 2026,
					isActive: 1
				})
				.returning();
			academicYearId = newYear[0].id;
			console.log(`✅ Created Academic Year: ${newYear[0].name}`);
		} else {
			academicYearId = activeYear[0].id;
			console.log(`ℹ️ Using existing Academic Year: ${activeYear[0].name}`);
		}

		// 2. Ensure Class Levels (Tingkat) exist
		console.log('\n--- Phase 2: Class Levels ---');
		const levelsToSeed = ['X', 'XI', 'XII'];
		const classMap = new Map();

		for (const level of levelsToSeed) {
			let existingClass = await db
				.select()
				.from(classes)
				.where(eq(classes.className, level))
				.limit(1);

			if (existingClass.length === 0) {
				const newClass = await db.insert(classes).values({ className: level }).returning();
				classMap.set(level, newClass[0].id);
				console.log(`✅ Created Class Level: ${level}`);
			} else {
				classMap.set(level, existingClass[0].id);
				console.log(`ℹ️ Using existing Class Level: ${level}`);
			}
		}

		// 3. Ensure Subjects exist
		console.log('\n--- Phase 3: Subjects ---');
		const subjectsData = [
			{ name: 'Matematika', subjectCode: 'MTK' },
			{ name: 'Bahasa Indonesia', subjectCode: 'BIND' },
			{ name: 'Bahasa Inggris', subjectCode: 'BING' },
			{ name: 'Fisika', subjectCode: 'FIS' },
			{ name: 'Kimia', subjectCode: 'KIM' },
			{ name: 'Biologi', subjectCode: 'BIO' }
		];

		const subjectMap = new Map();
		for (const subjectItem of subjectsData) {
			let existingSubject = await db
				.select()
				.from(Subjects)
				.where(eq(Subjects.name, subjectItem.name))
				.limit(1);

			if (existingSubject.length === 0) {
				const newSubject = await db.insert(Subjects).values(subjectItem).returning();
				subjectMap.set(subjectItem.name, newSubject[0].id);
				console.log(`✅ Created Subject: ${subjectItem.name}`);
			} else {
				subjectMap.set(subjectItem.name, existingSubject[0].id);
				console.log(`ℹ️ Using existing Subject: ${subjectItem.name}`);
			}
		}

		// 4. Create Teachers
		console.log('\n--- Phase 4: Teachers ---');
		const teachersToSeed = [
			{ fullName: 'Budi Santoso, S.Pd.', nip: '198001012005011001', gender: 'male' },
			{ fullName: 'Siti Aminah, M.Pd.', nip: '198502022010022002', gender: 'female' },
			{ fullName: 'Herman Yusuf, S.Si.', nip: '197503032000031003', gender: 'male' },
			{ fullName: 'Ani Maryani, S.S.', nip: '199004042015042004', gender: 'female' }
		];

		const teacherIds = [];
		for (const teacherData of teachersToSeed) {
			let existingTeacher = await db
				.select()
				.from(teachers)
				.where(eq(teachers.nip, teacherData.nip))
				.limit(1);

			if (existingTeacher.length === 0) {
				const newTeacher = await db.insert(teachers).values(teacherData).returning();
				teacherIds.push(newTeacher[0].id);
				console.log(`✅ Created Teacher: ${teacherData.fullName}`);
			} else {
				teacherIds.push(existingTeacher[0].id);
				console.log(`ℹ️ Using existing Teacher: ${teacherData.fullName}`);
			}
		}

		// 5. Create Rombels
		console.log('\n--- Phase 5: Rombels ---');
		const rombelIds = [];
		for (const [levelName, levelId] of classMap.entries()) {
			const rombelName = `${levelName}-A`;
			let existingRombel = await db
				.select()
				.from(rombel)
				.where(eq(rombel.name, rombelName))
				.limit(1);

			if (existingRombel.length === 0) {
				// Randomly assign a teacher as advisor
				const advisorId = teacherIds[Math.floor(Math.random() * teacherIds.length)];
				const newRombel = await db
					.insert(rombel)
					.values({
						name: rombelName,
						code: `${rombelName}-${Date.now()}`,
						classId: levelId,
						academicYearId: academicYearId,
						classAdvisorId: advisorId,
						classroom: `Room ${levelName}`,
						studentCapacity: 30
					})
					.returning();
				rombelIds.push(newRombel[0].id);
				console.log(`✅ Created Rombel: ${rombelName}`);
			} else {
				rombelIds.push(existingRombel[0].id);
				console.log(`ℹ️ Using existing Rombel: ${rombelName}`);
			}
		}

		// 6. Assign Subjects to Teachers (ClassSubject)
		console.log('\n--- Phase 6: Subject Assignments ---');
		const subjectEntries = Array.from(subjectMap.values());
		for (const levelId of classMap.values()) {
			for (let i = 0; i < subjectEntries.length; i++) {
				const subjectId = subjectEntries[i];
				const teacherId = teacherIds[i % teacherIds.length];

				// Check if assignment exists
				let existingAssignment = await db
					.select()
					.from(classSubject)
					.where(sql`${classSubject.classId} = ${levelId} AND ${classSubject.subjectId} = ${subjectId}`)
					.limit(1);

				if (existingAssignment.length === 0) {
					await db.insert(classSubject).values({
						classId: levelId,
						subjectId: subjectId,
						teacherId: teacherId
					});
				}
			}
		}
		console.log('✅ Subject assignments completed.');

		// 7. Create Students and Enroll them
		console.log('\n--- Phase 7: Students & Enrollment ---');
		const firstNames = ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gani', 'Hana', 'Indra', 'Joko'];
		const lastNames = ['Saputra', 'Lestari', 'Wijaya', 'Kusuma', 'Pratama', 'Sari', 'Hidayat', 'Putri'];

		for (const rombelId of rombelIds) {
			console.log(`Generating students for Rombel ID: ${rombelId}...`);
			for (let i = 0; i < 10; i++) {
				const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
				const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
				const fullName = `${firstName} ${lastName} ${i + 1}`;
				const nisn = `00${rombelId}${i}${Math.floor(1000 + Math.random() * 9000)}`;

				// Insert Student
				const [newStudent] = await db
					.insert(studentTable)
					.values({
						studentName: fullName,
						nisn: nisn,
						gender: i % 2 === 0 ? 'laki-laki' : 'Perempuan',
						status: 'ACTIVE',
						rombelId: rombelId
					})
					.returning();

				// Insert into Junction Table
				await db.insert(rombelStudents).values({
					rombelId: rombelId,
					studentId: newStudent.id,
					isActive: true
				});
			}
		}
		console.log('✅ Student generation and enrollment completed.');

		console.log('\n🎉 Academic Core Seeding Finished Successfully!');
	} catch (error) {
		console.error('\n❌ Seeding Failed:', error);
		throw error;
	}
}
