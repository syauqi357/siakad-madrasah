import { db } from '../../db/index.js';
import { classes } from '../../db/schema/classesDataTable.js';
import { teachers } from '../../db/schema/teacherUser.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { curriculum } from '../../db/schema/curriculum.js';
import { rombel } from '../../db/schema/classGroup.js';
import { eq, and } from 'drizzle-orm';

/**
 * SEED ROMBEL SYNC
 * Detects existing Classes and Teachers to form Rombels automatically.
 * Does not generate students.
 */
export async function seedRombelSync() {
	console.log('🔗 Starting Rombel Synchronization from existing data...');

	try {
		// 1. Fetch existing data
		const existingClasses = await db.select().from(classes).all();
		const existingTeachers = await db.select().from(teachers).all();
		const activeYear = await db.select().from(academicYear).where(eq(academicYear.isActive, 1)).get();
		const activeCurriculum = await db.select().from(curriculum).where(eq(curriculum.isActive, 1)).get();

		if (existingClasses.length === 0 || existingTeachers.length === 0) {
			console.error('❌ Missing Classes or Teachers! Run seedClasses and seedTeacher first.');
			throw new Error('Missing base data');
		}

		if (!activeYear) {
			console.error('❌ No active Academic Year found!');
			throw new Error('No active Academic Year');
		}

		console.log(`✅ Detected ${existingClasses.length} Class levels and ${existingTeachers.length} Teachers.`);

		// 2. Map and Create Rombels
		console.log('\n--- Phase 2: Mapping Rombels ---');
		
		let rombelCount = 0;
		// Use a pointer to distribute teachers as advisors
		let teacherIndex = 0;

		for (const classItem of existingClasses) {
			// Determine a readable name (e.g., VII becomes VII A)
			const rombelName = `${classItem.className} A`;
			
			// Check if this Rombel already exists for this year
			const existingRombel = await db.select().from(rombel).where(and(
				eq(rombel.name, rombelName),
				eq(rombel.academicYearId, activeYear.id)
			)).get();

			if (!existingRombel) {
				// Pick next teacher in list as advisor
				const advisor = existingTeachers[teacherIndex % existingTeachers.length];
				
				await db.insert(rombel).values({
					name: rombelName,
					code: `${rombelName.toUpperCase().replace(/\s+/g, '')}-${Date.now()}`,
					classId: classItem.id,
					academicYearId: activeYear.id,
					classAdvisorId: advisor.id,
					classroom: `Ruang ${classItem.className}`,
					studentCapacity: 32,
					kurikulum: activeCurriculum ? activeCurriculum.id.toString() : null
				}).run();

				console.log(`   ✅ Created Rombel: ${rombelName} | Advisor: ${advisor.fullName}`);
				rombelCount++;
				teacherIndex++;
			} else {
				console.log(`   ℹ️ Rombel ${rombelName} already exists. Skipping.`);
			}
		}

		console.log(`\n🎉 Synchronization Finished! Created ${rombelCount} Rombels.`);
	} catch (error) {
		console.error('\n❌ Synchronization Failed:', error);
		throw error;
	}
}
