import { db } from '../../db/index.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { eq } from 'drizzle-orm';

/**
 * SEED ACADEMIC YEAR
 * Populates the database with past, current, and future academic years.
 */
export async function seedAcademicYear() {
	console.log('📅 Seeding Academic Years...');

	try {
		const yearsToSeed = [
			{
				name: '2025/2026 Ganjil',
				startYear: 2025,
				endYear: 2026,
				startDate: '2025-07-14',
				endDate: '2025-12-19',
				isActive: 0
			}
		];

		for (const data of yearsToSeed) {
			const existing = await db
				.select()
				.from(academicYear)
				.where(eq(academicYear.name, data.name))
				.get();

			if (!existing) {
				await db.insert(academicYear).values(data).run();
				console.log(`   ✅ Created: ${data.name}`);
			} else {
				console.log(`   i  Skipped: ${data.name} (already exists)`);
			}
		}

		console.log('\n🎉 Academic Year seeding finished!');
	} catch (error) {
		console.error('\n❌ Seeding failed:', error);
		throw error;
	}
}
