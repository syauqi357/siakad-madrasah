import { db } from '../../db/index.js';
import { studentTable } from '../../db/schema/studentsdataTable.js';
import { studentAddress } from '../../db/schema/studentAddress.js';
import { studentFather } from '../../db/schema/studentFather.js';
import { studentMother } from '../../db/schema/studentMother.js';
import { rombel } from '../../db/schema/classGroup.js';
import { rombelStudents } from '../../db/schema/rombelStudents.js';
import { assessmentType } from '../../db/schema/assesmentType.js';
import { studentScores } from '../../db/schema/studentScore.js';
import { classSubject } from '../../db/schema/classesSubjectTable.js';
import { eq, and } from 'drizzle-orm';

/**
 * FULL STUDENT SEED
 * Creates students with complete profiles (Address, Parents) and populates scores.
 */
export async function seedFullStudents() {
	console.log('🚀 Starting Full Student & Performance Seeding...');

	try {
		// 1. Fetch academic base
		const existingRombels = await db.select().from(rombel).all();
		const assessments = await db.select().from(assessmentType).where(eq(assessmentType.isActive, true)).all();

		if (existingRombels.length === 0) {
			console.error('❌ No Rombels found! Run npm run db:seed:sync first.');
			throw new Error('No Rombels found');
		}

		// 2. Name pools for realistic Indonesian names
		const maleFirstNames = ['Aditya', 'Bagus', 'Candra', 'Dian', 'Eka', 'Fajar', 'Galih', 'Hendra', 'Indra', 'Jaka', 'Kurnia', 'Lukas', 'Mamat', 'Naufal', 'Oky', 'Pandu', 'Rizky', 'Surya', 'Taufik', 'Wahyu'];
		const femaleFirstNames = ['Anisa', 'Bunga', 'Citra', 'Dewi', 'Endah', 'Fitri', 'Gita', 'Hana', 'Indah', 'Juwita', 'Kartika', 'Laras', 'Maya', 'Nia', 'Putri', 'Ratih', 'Sari', 'Tiara', 'Utami', 'Wulan'];
		const lastNames = ['Pratama', 'Saputra', 'Wijaya', 'Kusuma', 'Lestari', 'Hidayat', 'Santoso', 'Ramadhan', 'Setiawan', 'Nugroho', 'Wibowo', 'Purnomo', 'Susanto', 'Gumilang', 'Hutapea', 'Siregar', 'Nasution', 'Manurung', 'Sihombing', 'Ginting'];
		
		const provinces = ['Jawa Timur', 'Jawa Tengah', 'Jawa Barat', 'DKI Jakarta', 'DI Yogyakarta', 'Banten'];
		const regencies = ['Bangil', 'Pasuruan', 'Sidoarjo', 'Surabaya', 'Malang', 'Gresik'];

		// 3. Generation Loop
		console.log(`\n--- Phase 1: Generating 30 New Students with Full Profiles ---`);
		
		for (let i = 0; i < 30; i++) {
			const isMale = Math.random() > 0.5;
			const firstName = isMale ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)] : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
			const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
			const fullName = `${firstName} ${lastName}`;
			const nisn = `00${Date.now().toString().slice(-6)}${i}`;
			
			// Select Rombel
			const selectedRombel = existingRombels[i % existingRombels.length];

			// Create Student
			const [newStudent] = await db.insert(studentTable).values({
				studentName: fullName,
				nisn: nisn,
				gender: isMale ? 'laki-laki' : 'Perempuan',
				status: 'ACTIVE',
				rombelId: selectedRombel.id,
				birthPlace: regencies[Math.floor(Math.random() * regencies.length)],
				birthDate: `200${Math.floor(Math.random() * 5) + 5}-01-01`,
				religion: 'Islam',
				nationality: 'Indonesia'
			}).returning().all();

			const studentId = newStudent.id;

			// Create Address
			await db.insert(studentAddress).values({
				studentId: studentId,
				province: provinces[Math.floor(Math.random() * provinces.length)],
				regency: regencies[Math.floor(Math.random() * regencies.length)],
				district: 'Kecamatan ' + (i + 1),
				village: 'Desa ' + (i + 1),
				street: 'Jl. Merdeka No. ' + (i + 1),
				postalCode: '6715' + (i % 9)
			}).run();

			// Create Father
			await db.insert(studentFather).values({
				studentId: studentId,
				name: `${lastNames[Math.floor(Math.random() * lastNames.length)]} Senior`,
				nik: `3514${Date.now().toString().slice(-8)}${i}`,
				occupation: 'Wiraswasta',
				isAlive: 1
			}).run();

			// Create Mother
			await db.insert(studentMother).values({
				studentId: studentId,
				name: femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)] + ' ' + lastName,
				nik: `3514${Date.now().toString().slice(-8)}${i + 100}`,
				occupation: 'Ibu Rumah Tangga',
				isAlive: 1
			}).run();

			// Enroll in Junction
			await db.insert(rombelStudents).values({
				rombelId: selectedRombel.id,
				studentId: studentId,
				isActive: true
			}).run();

			console.log(`   ✅ Created: ${fullName} (NISN: ${nisn}) -> ${selectedRombel.name}`);

			// 4. Generate Scores for this student
			const subjects = await db.select().from(classSubject).where(eq(classSubject.classId, selectedRombel.classId)).all();
			
			if (subjects.length > 0 && assessments.length > 0) {
				for (const cs of subjects) {
					for (const ass of assessments) {
						const randomScore = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
						await db.insert(studentScores).values({
							studentId: studentId,
							classSubjectId: cs.id,
							assessmentTypeId: ass.id,
							score: randomScore,
							assessmentDate: new Date().toISOString().split('T')[0]
						}).run();
					}
				}
			}
		}

		console.log(`\n--- Phase 2: Populating Scores for Existing Students ---`);
		const existingStudents = await db.select().from(studentTable).all();
		let scoreCount = 0;

		for (const student of existingStudents) {
			if (!student.rombelId) continue;

			// Find rombel info to get classId
			const r = await db.select().from(rombel).where(eq(rombel.id, student.rombelId)).get();
			if (!r) continue;

			const subjects = await db.select().from(classSubject).where(eq(classSubject.classId, r.classId)).all();
			
			for (const cs of subjects) {
				for (const ass of assessments) {
					// Check if score exists
					const exists = await db.select().from(studentScores).where(and(
						eq(studentScores.studentId, student.id),
						eq(studentScores.classSubjectId, cs.id),
						eq(studentScores.assessmentTypeId, ass.id)
					)).get();

					if (!exists) {
						const randomScore = Math.floor(Math.random() * (98 - 72 + 1)) + 72;
						await db.insert(studentScores).values({
							studentId: student.id,
							classSubjectId: cs.id,
							assessmentTypeId: ass.id,
							score: randomScore,
							assessmentDate: new Date().toISOString().split('T')[0]
						}).run();
						scoreCount++;
					}
				}
			}
		}
		console.log(`✅ Added ${scoreCount} missing scores to existing students.`);

		console.log('\n🎉 Holistic Seeding Finished! All students now have full profiles and scores.');
	} catch (error) {
		console.error('\n❌ Seeding Failed:', error);
		throw error;
	}
}
