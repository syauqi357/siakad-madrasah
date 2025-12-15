// backend/src/seed.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import { users } from './db/schema/user.js';

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

const guruData = JSON.parse(fs.readFileSync('./data/guru.json', 'utf8'))

async function seed() {
	console.log('🌱 Seeding database...');

	// add schooldata
	// table name in database : schoolData
	// table name in drizzle is : schoolTable
	for (const user of guruData){
		await db.insert(users).values(user)
	}

	console.log('✅ Seed data inserted successfully!');
	sqlite.close();
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
