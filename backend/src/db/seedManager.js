// src/db/seedManager.js
import path from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index.js';
import { users } from './schema/user.js';

// Import refactored seed functions
import { runSeedAuth } from '../utils/seedFile/seedAuth.js';
import { seedAcademicYear } from '../utils/seedFile/seedAcademicYear.js';
import { seedClassesAuto } from '../utils/seedFile/seedClassesAuto.js';
import { seedTeachers } from '../utils/seedFile/seedTeacher.js';
import { seedMapelKurikulum } from '../utils/seedFile/seedMapelKurikulum.js';
import { seedSchool } from '../utils/seedFile/seedSchool.js';
import { seedRombelSync } from '../utils/seedFile/seedRombelSync.js';
import { intelligentSync } from '../utils/seedFile/seedSyncAcademic.js';
import { seedFullStudents } from '../utils/seedFile/seedStudentFull.js';
import { seedStudentPerformance } from '../utils/seedFile/seedStudentPerformance.js';
import { generateSampleExcel } from '../utils/seedFile/generateSampleExcel.js';

/**
 * Orchestrates the database initialization.
 * 1. Runs migrations to ensure schema exists.
 * 2. Runs seeding if data is missing.
 */
export async function autoInitializeDatabase() {
	try {
		console.log('🚀 Initializing Database System...');
		
		// 1. Run Migrations First
		// This creates the tables if they don't exist
		console.log('🔄 Checking/Running Database Migrations...');
		try {
			const migrationsPath = path.join(process.cwd(), 'drizzle');
			console.log(`📂 Looking for migrations in: ${migrationsPath}`);
			migrate(db, { migrationsFolder: migrationsPath });
			console.log('✅ Database schema is up to date.');
		} catch (migError) {
			console.error('❌ Migration failed:', migError);
			// Continue anyway, maybe tables already exist from a template DB
		}

		// 2. Check if seeding is needed
		// We check for the admin user as a proxy for "is this DB seeded?"
		let adminExists = false;
		try {
			const existingUsers = await db.select().from(users).limit(1);
			adminExists = existingUsers.length > 0;
		} catch (queryError) {
			console.warn('⚠️ Could not query users table. Tables might not be ready yet.');
			adminExists = false;
		}

		if (adminExists) {
			console.log('ℹ️ Database already contains data, checking for missing critical records...');
			// Ensure school data exists even if other data is present
			await seedSchool();
			return;
		}

		console.log('🌱 Starting Parallel Database Seeding...');
		const startTime = Date.now();

		// WAVE 1: Independent Tables
		console.log('📦 Wave 1: Importing Base Data...');
		await Promise.all([
			seedAcademicYear(),
			seedClassesAuto(),
			runSeedAuth(),
			seedTeachers(),
			seedMapelKurikulum(),
			seedSchool()
		]);

		// WAVE 2: Relational Links
		console.log('🔗 Wave 2: Establishing Relationships...');
		await Promise.all([
			seedRombelSync(),
			intelligentSync()
		]);

		// WAVE 3: Content & Performance (sequential — both write to student_scores)
		console.log('📊 Wave 3: Generating Sample Students & Scores...');
		await seedFullStudents();
		await seedStudentPerformance();

		const duration = (Date.now() - startTime) / 1000;
		console.log(`✅ Parallel Seeding Complete in ${duration}s!`);

		// Drop a sample Excel in the user's Downloads folder for bulk import testing
		generateSampleExcel().catch((error) => {
			console.warn('⚠️ Could not generate sample Excel:', error.message);
		});
	} catch (error) {
		console.error('❌ Critical failure during auto-init:', error);
	}
}
