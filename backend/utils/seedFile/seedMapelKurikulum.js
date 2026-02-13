import 'dotenv/config';
import { db } from '../../src/index.js';
import { Subjects } from '../../src/db/schema/subjectTable.js';
import { curriculum } from '../../src/db/schema/curriculum.js';
import { assessmentType } from '../../src/db/schema/assesmentType.js';

async function seedMapelKurikulum() {
	console.log('🌱 Seeding Kurikulum & Mapel...\n');

	try {
		// ==========================================
		// 1. KURIKULUM
		// ==========================================
		console.log('📚 Seeding Kurikulum...');

		const kurikulumData = [
			{
				name: 'Kurikulum 2013',
				code: 'K13',
				year: '2013',
				description: 'Kurikulum nasional yang berlaku sejak tahun 2013',
				isActive: 0
			},
			{
				name: 'Kurikulum 2013 Revisi',
				code: 'K13-REV',
				year: '2017',
				description: 'Revisi Kurikulum 2013 dengan penyempurnaan kompetensi dasar',
				isActive: 0
			},
			{
				name: 'Kurikulum Merdeka',
				code: 'KM',
				year: '2022',
				description: 'Kurikulum Merdeka Belajar dengan pendekatan pembelajaran berbasis proyek',
				isActive: 1
			}
		];

		await db.insert(curriculum).values(kurikulumData).onConflictDoNothing();
		console.log(`   ✅ ${kurikulumData.length} kurikulum seeded`);

		// ==========================================
		// 2. MAPEL (Mata Pelajaran) - MA / Aliyah
		// ==========================================
		console.log('\n📖 Seeding Mapel MA (Madrasah Aliyah)...');

		const mapelData = [
			// ---- Kelompok A: Pendidikan Agama Islam ----
			{
				name: 'Al-Quran Hadits',
				subjectCode: 'QH',
				description: 'Kelompok A - Mata pelajaran Al-Quran dan Hadits',
				kkm: 75
			},
			{
				name: 'Aqidah Akhlak',
				subjectCode: 'AA',
				description: 'Kelompok A - Mata pelajaran Aqidah dan Akhlak',
				kkm: 75
			},
			{
				name: 'Fiqih',
				subjectCode: 'FQH',
				description: 'Kelompok A - Mata pelajaran Fiqih (hukum Islam)',
				kkm: 75
			},
			{
				name: 'Sejarah Kebudayaan Islam',
				subjectCode: 'SKI',
				description: 'Kelompok A - Sejarah peradaban dan kebudayaan Islam',
				kkm: 75
			},

			// ---- Kelompok A: Umum ----
			{
				name: 'Pendidikan Pancasila dan Kewarganegaraan',
				subjectCode: 'PPKN',
				description: 'Kelompok A - Pendidikan Pancasila dan Kewarganegaraan',
				kkm: 75
			},
			{
				name: 'Bahasa Indonesia',
				subjectCode: 'BIND',
				description: 'Kelompok A - Bahasa Indonesia',
				kkm: 75
			},
			{
				name: 'Bahasa Arab',
				subjectCode: 'BA',
				description: 'Kelompok A - Bahasa Arab',
				kkm: 75
			},
			{
				name: 'Matematika',
				subjectCode: 'MTK',
				description: 'Kelompok A - Matematika wajib',
				kkm: 75
			},
			{
				name: 'Sejarah Indonesia',
				subjectCode: 'SINDO',
				description: 'Kelompok A - Sejarah Indonesia',
				kkm: 75
			},
			{
				name: 'Bahasa Inggris',
				subjectCode: 'BING',
				description: 'Kelompok A - Bahasa Inggris',
				kkm: 75
			},

			// ---- Kelompok B: Umum ----
			{
				name: 'Seni Budaya',
				subjectCode: 'SB',
				description: 'Kelompok B - Seni dan Budaya',
				kkm: 70
			},
			{
				name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
				subjectCode: 'PJOK',
				description: 'Kelompok B - PJOK',
				kkm: 70
			},
			{
				name: 'Prakarya dan Kewirausahaan',
				subjectCode: 'PKWU',
				description: 'Kelompok B - Prakarya dan Kewirausahaan',
				kkm: 70
			},

			// ---- Kelompok C: Peminatan IPA ----
			{
				name: 'Fisika',
				subjectCode: 'FIS',
				description: 'Kelompok C - Peminatan MIPA',
				kkm: 75
			},
			{
				name: 'Kimia',
				subjectCode: 'KIM',
				description: 'Kelompok C - Peminatan MIPA',
				kkm: 75
			},
			{
				name: 'Biologi',
				subjectCode: 'BIO',
				description: 'Kelompok C - Peminatan MIPA',
				kkm: 75
			},
			{
				name: 'Matematika Peminatan',
				subjectCode: 'MTK-P',
				description: 'Kelompok C - Matematika peminatan MIPA',
				kkm: 75
			},

			// ---- Kelompok C: Peminatan IPS ----
			{
				name: 'Geografi',
				subjectCode: 'GEO',
				description: 'Kelompok C - Peminatan IPS',
				kkm: 75
			},
			{
				name: 'Sejarah',
				subjectCode: 'SEJ',
				description: 'Kelompok C - Peminatan IPS',
				kkm: 75
			},
			{
				name: 'Sosiologi',
				subjectCode: 'SOS',
				description: 'Kelompok C - Peminatan IPS',
				kkm: 75
			},
			{
				name: 'Ekonomi',
				subjectCode: 'EKO',
				description: 'Kelompok C - Peminatan IPS',
				kkm: 75
			}
		];

		await db.insert(Subjects).values(mapelData).onConflictDoNothing();
		console.log(`   ✅ ${mapelData.length} mapel seeded`);

		// ==========================================
		// 3. JENIS PENILAIAN (Assessment Types)
		// ==========================================
		console.log('\n📝 Seeding Jenis Penilaian...');

		const assessmentData = [
			// ---- Penilaian Harian ----
			{
				code: 'TGS',
				name: 'Tugas',
				defaultWeight: 10,
				isActive: true
			},
			{
				code: 'UH1',
				name: 'Ulangan Harian 1',
				defaultWeight: 10,
				isActive: true
			},
			{
				code: 'UH2',
				name: 'Ulangan Harian 2',
				defaultWeight: 10,
				isActive: true
			},
			{
				code: 'UH3',
				name: 'Ulangan Harian 3',
				defaultWeight: 10,
				isActive: true
			},

			// ---- Penilaian Tengah Semester ----
			{
				code: 'PTS',
				name: 'Penilaian Tengah Semester',
				defaultWeight: 20,
				isActive: true
			},

			// ---- Penilaian Akhir Semester ----
			{
				code: 'PAS',
				name: 'Penilaian Akhir Semester',
				defaultWeight: 25,
				isActive: true
			},
			{
				code: 'PAT',
				name: 'Penilaian Akhir Tahun',
				defaultWeight: 25,
				isActive: true
			},

			// ---- Ujian Sekolah / Madrasah ----
			{
				code: 'USM',
				name: 'Ujian Sekolah/Madrasah',
				defaultWeight: null,
				isActive: true
			},

			// ---- Penilaian Tambahan ----
			{
				code: 'PRAKTIK',
				name: 'Penilaian Praktik',
				defaultWeight: 15,
				isActive: true
			},
			{
				code: 'PROJEK',
				name: 'Penilaian Proyek',
				defaultWeight: 15,
				isActive: true
			},
			{
				code: 'PORTO',
				name: 'Portofolio',
				defaultWeight: null,
				isActive: true
			}
		];

		await db.insert(assessmentType).values(assessmentData).onConflictDoNothing();
		console.log(`   ✅ ${assessmentData.length} jenis penilaian seeded`);

		console.log('\n🎉 Seeding selesai!');
	} catch (error) {
		console.error('❌ Seeding gagal:', error);
	}

	process.exit(0);
}

seedMapelKurikulum();
