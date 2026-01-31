import 'dotenv/config';
import { db } from '../../src/index.js';
import { studentTable } from '../../src/db/schema/studentsdataTable.js';
import { assessmentType } from '../../src/db/schema/assesmentType.js';
import { classes } from '../../src/db/schema/classesDataTable.js';
import { Subjects } from '../../src/db/schema/subjectTable.js';
import { classSubject } from '../../src/db/schema/classesSubjectTable.js';
import { teachers } from '../../src/db/schema/teacherUser.js';
import { users } from '../../src/db/schema/user.js';
import { academicYear } from '../../src/db/schema/academicYear.js'; // Import Academic Year
import path from 'path';
import { eq } from 'drizzle-orm';

async function seed() {
	console.log('📂 Database Path:', path.resolve(process.env.DATABASE_URL));
	console.log('🌱 Seeding database...');

	try {
		// 1. Create User & Teacher (Required for ClassSubject)
		console.log('Creating Teacher...');
		// Check if user exists
		let user = await db.select().from(users).where(eq(users.username, 'teacher1')).limit(1);
		let userId;

		if (user.length === 0) {
			const newUser = await db
				.insert(users)
				.values({
					username: 'teacher1',
					password: 'password123',
					email: 'teacher@school.com',
					role: 'teacher',
					nama_lengkap: 'Pak Budi'
				})
				.returning();
			userId = newUser[0].id;
		} else {
			userId = user[0].id;
		}

		// Check if teacher exists
		let teacher = await db.select().from(teachers).where(eq(teachers.userId, userId)).limit(1);
		let teacherId;

		if (teacher.length === 0) {
			const newTeacher = await db
				.insert(teachers)
				.values({
					userId: userId,
					fullName: 'Pak Budi Santoso',
					nip: '198001012005011001'
				})
				.returning();
			teacherId = newTeacher[0].id;
		} else {
			teacherId = teacher[0].id;
		}

		// 2. Create Assessment Types
		console.log('Creating Assessment Types...');
		await db
			.insert(assessmentType)
			.values([
				{ code: 'UH1', name: 'Ulangan Harian 1' },
				{ code: 'UTS', name: 'Ujian Tengah Semester' },
				{ code: 'UAS', name: 'Ujian Akhir Semester' }
			])
			.onConflictDoNothing();

		// 3. Create Class (Grade Level)
		console.log('Creating Class...');
		// Check if class exists (assuming className is not unique in schema but we treat it as such for seeding)
		let classData = await db.select().from(classes).where(eq(classes.className, 'X')).limit(1);
		let classId;

		if (classData.length === 0) {
			const newClass = await db.insert(classes).values({ className: 'X' }).returning();
			classId = newClass[0].id;
		} else {
			classId = classData[0].id;
		}

		// 3.5 Create Academic Year (CRITICAL for Rombel)
		console.log('Creating Academic Year...');
		let year = await db
			.select()
			.from(academicYear)
			.where(eq(academicYear.name, '2025/2026 Genap'))
			.limit(1);
		let academicYearId;

		if (year.length === 0) {
			const newYear = await db
				.insert(academicYear)
				.values({
					name: '2025/2026 Genap',
					startYear: 2025,
					endYear: 2026,
					isActive: 1
				})
				.returning();
			academicYearId = newYear[0].id;
		} else {
			academicYearId = year[0].id;
		}

		// 4. Create Subject
		console.log('Creating Subject...');
		// Subjects name is unique
		await db
			.insert(Subjects)
			.values({
				name: 'Matematika',
				subjectCode: 'MTK'
			})
			.onConflictDoNothing();

		const subject = await db
			.select()
			.from(Subjects)
			.where(eq(Subjects.name, 'Matematika'))
			.limit(1);
		const subjectId = subject[0].id;

		// 5. Create ClassSubject (Link Class + Subject + Teacher)
		console.log('Creating ClassSubject...');
		// Check if link exists
		let csLink = await db
			.select()
			.from(classSubject)
			.where(eq(classSubject.classId, classId)) // Simplified check
			.limit(1);

		// We need to be more specific or just try insert
		let classSubjectId;
		try {
			const newCS = await db
				.insert(classSubject)
				.values({
					classId: classId,
					subjectId: subjectId,
					teacherId: teacherId
				})
				.returning();
			classSubjectId = newCS[0].id;
		} catch (e) {
			// Likely unique constraint violation, fetch existing
			const existingCS = await db
				.select()
				.from(classSubject)
				.where(eq(classSubject.classId, classId)) // This is a weak check, but sufficient for simple seed
				.limit(1);
			if (existingCS.length > 0) classSubjectId = existingCS[0].id;
		}

		// 6. Create Students
		console.log('Creating Students...');
		await db
			.insert(studentTable)
			.values([
				{ studentName: 'Ahmad', nisn: 1234567890 },
				{ studentName: 'Budi', nisn: 1234567891 },
				{ studentName: 'Citra', nisn: 1234567892 }
			])
			.onConflictDoNothing();

		// Fetch student IDs for logging
		const students = await db.select().from(studentTable).limit(3);

		console.log('✅ Seeding complete!');
		console.log(`👉 Use classSubjectId: ${classSubjectId}`);
		console.log(`👉 Use academicYearId: ${academicYearId}`);
		console.log(`👉 Use assessmentTypeId: 1 (UH1)`);
		console.log(`👉 Use studentIds: ${students.map((s) => s.id).join(', ')}`);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
	}
	process.exit(0);
}

seed();
