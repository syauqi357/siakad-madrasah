import { db } from '../../db/index.js';
import { studentTable } from '../../db/schema/studentsdataTable.js';
import { rombel } from '../../db/schema/classGroup.js';
import { rombelStudents } from '../../db/schema/rombelStudents.js';
import { assessmentType } from '../../db/schema/assesmentType.js';
import { studentScores } from '../../db/schema/studentScore.js';
import { classSubject } from '../../db/schema/classesSubjectTable.js';
import { eq, and, sql } from 'drizzle-orm';

/**
 * OPTIMIZED STUDENT PERFORMANCE SEED
 * 1. Aligns with existing codes (TGS, UH1, PTS, PAS)
 * 2. Uses a single Transaction to eliminate SQLite bottlenecks
 */
export async function seedStudentPerformance() {
	console.log('🚀 Starting Optimized Student Performance Seeding...');

	try {
		// 1. Align with your actual Curriculum codes
		console.log('\n--- Phase 1: Aligning Assessment Types ---');
		const standardAssessments = [
			{ code: 'TGS', name: 'Tugas', weight: 10 },
			{ code: 'UH1', name: 'Ulangan Harian 1', weight: 15 },
			{ code: 'PTS', name: 'Penilaian Tengah Semester', weight: 30 },
			{ code: 'PAS', name: 'Penilaian Akhir Semester', weight: 45 }
		];

		const assessmentIds = [];
		for (const item of standardAssessments) {
			let existing = await db
				.select()
				.from(assessmentType)
				.where(eq(assessmentType.code, item.code))
				.get();

			if (!existing) {
				const [created] = await db
					.insert(assessmentType)
					.values({
						code: item.code,
						name: item.name,
						defaultWeight: item.weight,
						isActive: true
					})
					.returning()
					.all();
				assessmentIds.push(created.id);
				console.log(`✅ Created Assessment Type: ${item.code}`);
			} else {
				assessmentIds.push(existing.id);
				console.log(`ℹ️ Using existing Assessment Type: ${existing.code}`);
			}
		}

		// 2. Fetch Base Structure
		const rombels = await db.select().from(rombel).all();
		if (rombels.length === 0) {
			console.error('❌ No Rombels found! Run npm run db:seed:sync first.');
			throw new Error('No Rombels found');
		}

		// 3. Optimized Generation Loop inside ONE Transaction
		console.log('\n--- Phase 2: Generating Performance Data (High Speed) ---');
		
		await db.transaction(async (tx) => {
			for (const r of rombels) {
				console.log(`   Processing ${r.name}...`);
				
				// Get subjects for this class
				const subjects = await tx
					.select()
					.from(classSubject)
					.where(eq(classSubject.classId, r.classId))
					.all();

				// Get all students currently in this rombel (includes your existing 55 students)
				const studentsInRombel = await tx
					.select()
					.from(studentTable)
					.where(eq(studentTable.rombelId, r.id))
					.all();

				if (subjects.length === 0) continue;

				for (const student of studentsInRombel) {
					for (const cs of subjects) {
						for (const aid of assessmentIds) {
							// Realistic score range: 75 to 98
							const randomScore = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
							
							// Using onConflictDoNothing for extra speed and safety
							await tx.insert(studentScores).values({
								studentId: student.id,
								classSubjectId: cs.id,
								assessmentTypeId: aid,
								score: randomScore,
								assessmentDate: new Date().toISOString().split('T')[0]
							}).onConflictDoNothing().run();
						}
					}
				}
			}
		});

		console.log('\n🎉 Performance Seeding Complete!');
		console.log('✅ Synchronized with TGS, UH1, PTS, and PAS.');
		console.log('✅ Bottleneck removed. Thousands of scores inserted in seconds.');
	} catch (error) {
		console.error('\n❌ Seeding Failed:', error);
		throw error;
	}
}
