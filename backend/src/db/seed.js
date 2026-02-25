// backend/src/seed.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { users } from './schema/user.js';

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

const guruData = JSON.parse(fs.readFileSync('./data/guru.json', 'utf8'));

async function seed() {
	console.log('🌱 Seeding database...');

	// add schooldata
	// table name in database : schoolAdministrativeData
	// table name in drizzle is : schoolTable
	for (const user of guruData) {
		const hashedPassword = await bcrypt.hash(user.password, 10);

		await db.insert(users).values({
			...user,
			password: hashedPassword
		});

		console.log(`user ${user.username}inserted with hashed`);
	}

	console.log('✅ Seed data inserted successfully!');
	sqlite.close();
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
