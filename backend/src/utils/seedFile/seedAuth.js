import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../../db/index.js';
import { users } from '../../db/schema/user.js';
import { eq } from 'drizzle-orm';

async function seedAuth() {
	console.log('🌱 Seeding Authentication Users...\n');

	try {
		const saltRounds = 10;

		const usersData = [
			{
				username: 'Admin',
				password: await bcrypt.hash('password123', saltRounds),
				email: 'admin@madrasah.sch.id',
				role: 'admin',
				nama_lengkap: 'Administrator',
				jabatan: 'Administrator Sistem'
			},
			{
				username: 'guru1',
				password: await bcrypt.hash('guru123', saltRounds),
				email: 'guru1@madrasah.sch.id',
				role: 'teacher',
				nama_lengkap: 'Siti Aminah',
				nip: '198505152010012001',
				jabatan: 'Guru Matematika'
			}
		];

		for (const userData of usersData) {
			const existing = await db
				.select()
				.from(users)
				.where(eq(users.username, userData.username))
				.limit(1);

			if (existing.length === 0) {
				await db.insert(users).values(userData);
				console.log(`   ✅ User '${userData.username}' (${userData.role}) created`);
			} else {
				console.log(`   ⏭️  User '${userData.username}' already exists, skipped`);
			}
		}

		console.log('\n📋 Login credentials:');
		console.log('   Admin  → username: Admin  | password: password123');
		console.log('   Guru   → username: guru1  | password: guru123');
		console.log('\n🎉 Auth seeding selesai!');
	} catch (error) {
		console.error('❌ Auth seeding gagal:', error);
	}

	process.exit(0);
}

seedAuth();
