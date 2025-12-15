// backend/src/seed.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { studentTable } from './db/schema/studentsdataTable.js';
import { schoolTable } from './db/schema/schooldataTable.js';

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

async function seed() {
	console.log('🌱 Seeding database...');

	// add schooldata
	// table name in database : schoolData
	// table name in drizzle is : schoolTable
	await db.insert(schoolTable).values([
		{
			name: 'MTs Al-hasyimiy',
			npsn: 123456789,
			nsm: 123456,
			akreditasi: 'A',
			alamat: 'jalan JA suprapto 223',
			kota: 'bangil',
			negara: 'indonesia',
			logoUrl: ''
		}
	]);

	console.log('✅ Seed data inserted successfully!');
	sqlite.close();
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
