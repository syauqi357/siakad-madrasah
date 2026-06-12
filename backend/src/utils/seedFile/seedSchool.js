import { db } from '../../db/index.js';
import { schoolDataTable } from '../../db/schema/schooldataTable.js';

export async function seedSchool() {
	console.log('🌱 Seeding School Data...\n');

	try {
		const existing = await db.select().from(schoolDataTable).limit(1);
		if (existing.length > 0) {
			console.log('   ℹ️ School data already exists. Skipping.');
			return;
		}

		const defaultSchool = {
			name: 'MTs. AL-HASYIMIY',
			npsn: 84729834789,
			nsm: 73210987219,
			akreditasi: 'B',
			alamat: 'Jalan KH Abdul Rahman Wahid No.3 Gang 7',
			kota: 'Bangil',
			negara: 'Indonesia',
			logoUrl: ''
		};

		await db.insert(schoolDataTable).values(defaultSchool).run();
		console.log('   ✅ School data seeded successfully');
	} catch (error) {
		console.error('❌ School seeding failed:', error);
		throw error;
	}
}
