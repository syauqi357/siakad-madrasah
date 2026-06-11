import 'dotenv/config';
import { db } from '../../db/index.js';
import { academicYear } from '../../db/schema/academicYear.js';
import { eq } from 'drizzle-orm';

/**
 * SEED ACADEMIC YEAR
 * Populates the database with past, current, and future academic years.
 */
async function seedAcademicYear() {
	console.log('📅 Seeding Academic Years...');

	try {
		const yearsToSeed = [
			{
				name: '2023/2024 Ganjil',
				startYear: 2023,
				endYear: 2024,
				startDate: '2023-07-17',
				endDate: '2023-12-22',
				isActive: 0
			},
			{
				name: '2023/2024 Genap',
				startYear: 2023,
				endYear: 2024,
				startDate: '2024-01-02',
				endDate: '2024-06-21',
				isActive: 0
			},
			{
				name: '2024/2025 Ganjil',
				startYear: 2024,
				endYear: 2025,
				startDate: '2024-07-15',
				endDate: '2024-12-20',
				isActive: 1 // SET AS ACTIVE
			},
			{
				name: '2024/2025 Genap',
				startYear: 2024,
				endYear: 2025,
				startDate: '2025-01-06',
				endDate: '2025-06-20',
				isActive: 0
			},
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
				console.log(`   ℹ️  Skipped: ${data.name} (already exists)`);
			}
		}

		console.log('\n🎉 Academic Year seeding finished!');
	} catch (error) {
		console.error('\n❌ Seeding failed:', error);
	} finally {
		process.exit(0);
	}
}

seedAcademicYear();
