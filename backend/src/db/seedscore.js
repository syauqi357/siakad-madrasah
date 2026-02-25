import 'dotenv/config';
import { db } from './index.js';
import { studentTable } from './schema/studentsdataTable.js';
import { assessmentType } from './schema/assesmentType.js';
import { classes } from './schema/classesDataTable.js';
import { Subjects } from './schema/subjectTable.js';
import { classSubject } from './schema/classesSubjectTable.js';
import { teachers } from './schema/teacherUser.js';
import { users } from './schema/user.js';

async function seedscore() {
	console.log('🌱 Seeding database...');

	try {
		// 1. Create User & Teacher (Required for ClassSubject)
		console.log('Creating Teacher...');
		const user = await db
			.insert(users)
			.values({
				username: 'teacher1',
				password: 'password123', // In real app, hash this!
				email: 'teacher@school.com',
				role: 'teacher',
				nama_lengkap: 'Pak Budi'
			})
			.returning();

		const teacher = await db
			.insert(teachers)
			.values({
				userId: user[0].id,
				fullName: 'Pak Budi Santoso',
				nip: '198001012005011001'
			})
			.returning();

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
		const classData = await db
			.insert(classes)
			.values({
				className: 'X'
			})
			.returning();

		// 4. Create Subject
		console.log('Creating Subject...');
		const subject = await db
			.insert(Subjects)
			.values({
				name: 'Matematika',
				subjectCode: 'MTK'
			})
			.returning();

		// 5. Create ClassSubject (Link Class + Subject + Teacher)
		console.log('Creating ClassSubject...');
		const classSubjectData = await db
			.insert(classSubject)
			.values({
				classId: classData[0].id,
				subjectId: subject[0].id,
				teacherId: teacher[0].id
			})
			.returning();

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

		console.log('✅ Seeding complete!');
		console.log(`👉 Use classSubjectId: ${classSubjectData[0].id}`);
		console.log(`👉 Use assessmentTypeId: 1 (UH1)`);
		console.log(`👉 Use studentIds: 1, 2, 3`);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
	}
	process.exit(0);
}

seedscore();
