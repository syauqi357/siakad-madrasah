import { db } from '../../db/index.js';
import { teachers } from '../../db/schema/teacherUser.js';

export async function seedTeachers() {
	console.log('🌱 Seeding Teachers...\n');

	try {
		console.log('Seeding Data Guru...');

		const teacherData = [
			{
				nip: '198001012005011001',
				fullName: 'Ahmad Dahlan, S.Pd., M.Pd.',
				gender: 'male',
				birthPlace: 'Yogyakarta',
				birthDate: '1980-01-01',
				religion: 'Islam',
				phoneNumber: '081234567890',
				personalEmail: 'ahmad.dahlan@example.com',
				profilePhoto: null
			},
			{
				nip: '198502022010022002',
				fullName: 'Siti Aminah, S.Ag.',
				gender: 'female',
				birthPlace: 'Surabaya',
				birthDate: '1985-02-02',
				religion: 'Islam',
				phoneNumber: '081298765432',
				personalEmail: 'siti.aminah@example.com',
				profilePhoto: null
			},
			{
				nip: '197503032000031003',
				fullName: 'Budi Santoso, S.Si.',
				gender: 'male',
				birthPlace: 'Bandung',
				birthDate: '1975-03-03',
				religion: 'Islam',
				phoneNumber: '081345678912',
				personalEmail: 'budi.santoso@example.com',
				profilePhoto: null
			},
			{
				nip: '199004042015042004',
				fullName: 'Dewi Lestari, S.S.',
				gender: 'female',
				birthPlace: 'Jakarta',
				birthDate: '1990-04-04',
				religion: 'Islam',
				phoneNumber: '081567891234',
				personalEmail: 'dewi.lestari@example.com',
				profilePhoto: null
			},
			{
				nip: '198205052008051005',
				fullName: 'Hasan Basri, Lc., M.A.',
				gender: 'male',
				birthPlace: 'Malang',
				birthDate: '1982-05-05',
				religion: 'Islam',
				phoneNumber: '081987654321',
				personalEmail: 'hasan.basri@example.com',
				profilePhoto: null
			},
			{
				nip: '198808172014022006',
				fullName: 'Rina Wati, S.Pd.',
				gender: 'female',
				birthPlace: 'Semarang',
				birthDate: '1988-08-17',
				religion: 'Islam',
				phoneNumber: '085712345678',
				personalEmail: 'rina.wati@example.com',
				profilePhoto: null
			},
			{
				nip: '197909092003121007',
				fullName: 'Eko Prasetyo, S.Kom., M.T.',
				gender: 'male',
				birthPlace: 'Surakarta',
				birthDate: '1979-09-09',
				religion: 'Islam',
				phoneNumber: '081223344556',
				personalEmail: 'eko.prasetyo@example.com',
				profilePhoto: null
			},
			{
				nip: '199211252018012008',
				fullName: 'Nurul Hidayah, S.Pd.I.',
				gender: 'female',
				birthPlace: 'Makassar',
				birthDate: '1992-11-25',
				religion: 'Islam',
				phoneNumber: '082199887766',
				personalEmail: 'nurul.hidayah@example.com',
				profilePhoto: null
			},
			{
				nip: '198312122009031009',
				fullName: 'Arif Rahman Hakim, M.Pd.',
				gender: 'male',
				birthPlace: 'Padang',
				birthDate: '1983-12-12',
				religion: 'Islam',
				phoneNumber: '085233445566',
				personalEmail: 'arif.rahman@example.com',
				profilePhoto: null
			},
			{
				nip: '198707072011012010',
				fullName: 'Fitriani, S.E., M.Ak.',
				gender: 'female',
				birthPlace: 'Medan',
				birthDate: '1987-07-07',
				religion: 'Islam',
				phoneNumber: '081344556677',
				personalEmail: 'fitriani.ak@example.com',
				profilePhoto: null
			}
		];

		await db.insert(teachers).values(teacherData).onConflictDoNothing();
		console.log(`   ✅ ${teacherData.length} guru seeded`);

		console.log('\n🎉 Seeding selesai!');
	} catch (error) {
		console.error('❌ Seeding gagal:', error);
		throw error;
	}
}
