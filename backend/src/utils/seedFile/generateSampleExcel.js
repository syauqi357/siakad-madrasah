import ExcelJS from 'exceljs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Must match EXCEL_HEADER_MAP keys in student.service.js exactly
const HEADERS = [
	'Nama Siswa', 'NISN', 'NIS Lokal', 'NIK / No. KTP', 'No. Akta Kelahiran',
	'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Anak Ke-', 'Jumlah Saudara',
	'Kewarganegaraan', 'Agama', 'No. HP Siswa', 'Sekolah Sebelumnya', 'Tinggal Bersama',
	'Transportasi', 'No. BPJS',
	'Alamat - Jalan', 'Alamat - No. Rumah', 'Alamat - RT', 'Alamat - RW',
	'Alamat - Desa/Kelurahan', 'Alamat - Kecamatan', 'Alamat - Kab/Kota',
	'Alamat - Provinsi', 'Alamat - Kode Pos',
	'Ayah - Nama', 'Ayah - NIK', 'Ayah - Pekerjaan', 'Ayah - No. HP',
	'Ayah - Tempat Lahir', 'Ayah - Tanggal Lahir', 'Ayah - Tahun Lahir',
	'Ayah - Pendidikan', 'Ayah - Penghasilan', 'Ayah - Status',
	'Ibu - Nama', 'Ibu - NIK', 'Ibu - Pekerjaan', 'Ibu - No. HP',
	'Ibu - Tempat Lahir', 'Ibu - Tanggal Lahir', 'Ibu - Tahun Lahir',
	'Ibu - Pendidikan', 'Ibu - Penghasilan', 'Ibu - Status',
];

const STUDENTS = [
	['Ahmad Fauzi Santoso','0123456701','NIS001','3514010101100001','AK-001-2010','Laki-laki','Bangil','2010-01-15','1','2','WNI','Islam','081234567001','SDN 1 Bangil','Orang Tua','Motor','BPJS001234567','Jl. KH Wahid Hasyim','10','001','002','Bangil','Bangil','Pasuruan','Jawa Timur','67153','Hasan Santoso','3514010101700001','Wiraswasta','082345678001','Pasuruan','1975-03-10','1975','SMA','3000000','Hidup','Siti Aisyah','3514010101780001','Ibu Rumah Tangga','083456789001','Bangil','1978-07-22','1978','SMA','0','Hidup'],
	['Dewi Rahmawati','0123456702','NIS002','3514020202100002','AK-002-2010','Perempuan','Pasuruan','2010-03-20','2','3','WNI','Islam','081234567002','SDN 2 Pasuruan','Orang Tua','Angkot','BPJS001234568','Jl. Diponegoro','5','003','004','Pogar','Bangil','Pasuruan','Jawa Timur','67153','Rahmat Wijaya','3514020202700002','PNS','082345678002','Pasuruan','1972-05-18','1972','S1','5000000','Hidup','Nur Hasanah','3514020202750002','Guru','083456789002','Pasuruan','1975-09-30','1975','S1','4500000','Hidup'],
	['Muhammad Rizky Pratama','0123456703','NIS003','3514030303100003','AK-003-2010','Laki-laki','Malang','2010-06-08','1','1','WNI','Islam','081234567003','SDN 3 Malang','Orang Tua','Motor','BPJS001234569','Jl. Soekarno Hatta','22','005','001','Kiduldalem','Klojen','Malang','Jawa Timur','65119','Agus Pratama','3514030303680003','Pedagang','082345678003','Malang','1968-11-25','1968','SMP','2500000','Hidup','Fatimah Zahra','3514030303720003','Ibu Rumah Tangga','083456789003','Malang','1972-04-14','1972','SMA','0','Hidup'],
	['Siti Nurhaliza','0123456704','NIS004','3514040404100004','AK-004-2010','Perempuan','Sidoarjo','2010-09-12','3','4','WNI','Islam','081234567004','MI Al-Huda','Nenek','Jalan Kaki','BPJS001234570','Jl. Ahmad Yani','7','002','003','Celep','Sidoarjo','Sidoarjo','Jawa Timur','61214','Wahyu Hidayat','3514040404690004','Buruh','082345678004','Sidoarjo','1969-08-05','1969','SD','1800000','Hidup','Aminah Lestari','3514040404730004','Pedagang','083456789004','Sidoarjo','1973-12-01','1973','SMP','1500000','Hidup'],
	['Ilham Saputra','0123456705','NIS005','3514050505100005','AK-005-2010','Laki-laki','Surabaya','2010-11-30','2','2','WNI','Islam','081234567005','SDN 5 Surabaya','Orang Tua','Bus','BPJS001234571','Jl. Raya Darmo','15','006','002','Darmo','Wonokromo','Surabaya','Jawa Timur','60241','Budi Saputra','3514050505710005','Karyawan Swasta','082345678005','Surabaya','1971-02-28','1971','SMA','4000000','Hidup','Endah Wulandari','3514050505740005','Ibu Rumah Tangga','083456789005','Surabaya','1974-06-17','1974','SMA','0','Hidup'],
	['Nurul Hidayah','0123456706','NIS006','3514060606100006','AK-006-2010','Perempuan','Bangil','2010-04-25','1','2','WNI','Islam','081234567006','SDN 4 Bangil','Orang Tua','Motor','BPJS001234572','Jl. Raya Bangil','30','001','005','Bangil','Bangil','Pasuruan','Jawa Timur','67153','Syukur Hidayat','3514060606730006','Petani','082345678006','Bangil','1973-09-12','1973','SMP','2000000','Hidup','Romlah','3514060606760006','Ibu Rumah Tangga','083456789006','Bangil','1976-03-08','1976','SD','0','Hidup'],
	['Farid Maulana','0123456707','NIS007','3514070707100007','AK-007-2010','Laki-laki','Probolinggo','2010-07-19','2','3','WNI','Islam','081234567007','SDN 2 Probolinggo','Orang Tua','Sepeda','BPJS001234573','Jl. Panglima Sudirman','8','003','001','Mangunharjo','Mayangan','Probolinggo','Jawa Timur','67212','Eko Maulana','3514070707700007','Nelayan','082345678007','Probolinggo','1970-12-03','1970','SMP','2200000','Hidup','Halimah','3514070707740007','Ibu Rumah Tangga','083456789007','Probolinggo','1974-05-29','1974','SMP','0','Hidup'],
	['Ayu Lestari','0123456708','NIS008','3514080808100008','AK-008-2010','Perempuan','Malang','2010-02-14','2','2','WNI','Islam','081234567008','MI Miftahul Huda','Orang Tua','Motor','BPJS001234574','Jl. Veteran','45','004','003','Penanggungan','Klojen','Malang','Jawa Timur','65116','Dodik Lestari','3514080808690008','Sopir','082345678008','Malang','1969-06-22','1969','SMA','2800000','Hidup','Sumiati','3514080808730008','Pedagang','083456789008','Malang','1973-10-11','1973','SMA','1200000','Hidup'],
	['Rafi Abdillah','0123456709','NIS009','3514090909100009','AK-009-2010','Laki-laki','Gresik','2010-08-03','3','3','WNI','Islam','081234567009','SDN 1 Gresik','Orang Tua','Motor','BPJS001234575','Jl. Dr. Sutomo','12','002','004','Kebomas','Kebomas','Gresik','Jawa Timur','61122','Saiful Abdillah','3514090909670009','Pedagang','082345678009','Gresik','1967-04-15','1967','SMA','3500000','Hidup','Umi Kulsum','3514090909710009','Ibu Rumah Tangga','083456789009','Gresik','1971-08-26','1971','SMP','0','Hidup'],
	['Zahra Aulia','0123456710','NIS010','3514101010100010','AK-010-2010','Perempuan','Bangil','2010-05-07','1','1','WNI','Islam','081234567010','SDN 3 Bangil','Orang Tua','Angkot','BPJS001234576','Jl. Raya Pogar','3','005','002','Pogar','Bangil','Pasuruan','Jawa Timur','67153','Hendra Aulia','3514101010760010','TNI','082345678010','Bangil','1976-01-19','1976','SMA','4500000','Hidup','Yuni Astuti','3514101010790010','Ibu Rumah Tangga','083456789010','Bangil','1979-11-04','1979','SMA','0','Hidup'],
	['Bagas Wibowo','0123456711','NIS011','3514111111100011','AK-011-2010','Laki-laki','Kediri','2010-10-22','2','4','WNI','Islam','081234567011','SDN 4 Kediri','Orang Tua','Sepeda','BPJS001234577','Jl. Brawijaya','19','001','003','Mojoroto','Mojoroto','Kediri','Jawa Timur','64112','Slamet Wibowo','3514111111660011','Petani','082345678011','Kediri','1966-07-30','1966','SD','1600000','Hidup','Poniyem','3514111111700011','Ibu Rumah Tangga','083456789011','Kediri','1970-02-16','1970','SD','0','Hidup'],
	['Intan Permata','0123456712','NIS012','3514121212100012','AK-012-2010','Perempuan','Surabaya','2010-12-18','2','2','WNI','Islam','081234567012','SDN 7 Surabaya','Orang Tua','Motor','BPJS001234578','Jl. Raya Gubeng','28','003','005','Gubeng','Gubeng','Surabaya','Jawa Timur','60281','Arif Permata','3514121212720012','Teknisi','082345678012','Surabaya','1972-09-07','1972','D3','3800000','Hidup','Dewi Kartika','3514121212760012','Karyawan Swasta','083456789012','Surabaya','1976-04-23','1976','D3','3200000','Hidup'],
	['Dimas Ardiansyah','0123456713','NIS013','3514131313100013','AK-013-2010','Laki-laki','Bangil','2010-03-11','1','3','WNI','Islam','081234567013','MI Nurul Ulum','Orang Tua','Motor','BPJS001234579','Jl. Merdeka','6','004','001','Kalirejo','Bangil','Pasuruan','Jawa Timur','67153','Misbah Ardiansyah','3514131313710013','Karyawan Swasta','082345678013','Bangil','1971-05-14','1971','SMA','3200000','Hidup','Khusnul Khotimah','3514131313740013','Ibu Rumah Tangga','083456789013','Bangil','1974-09-28','1974','SMA','0','Hidup'],
	['Laila Maghfiroh','0123456714','NIS014','3514141414100014','AK-014-2010','Perempuan','Pasuruan','2010-06-29','3','3','WNI','Islam','081234567014','SDN 6 Pasuruan','Orang Tua','Jalan Kaki','BPJS001234580','Jl. Untung Suropati','11','002','002','Karangketug','Gadingrejo','Pasuruan','Jawa Timur','67134','Nasrul Maghfiroh','3514141414690014','Buruh Pabrik','082345678014','Pasuruan','1969-11-08','1969','SMP','2400000','Hidup','Maysaroh','3514141414730014','Pedagang','083456789014','Pasuruan','1973-03-17','1973','SMP','900000','Hidup'],
	['Farel Prayoga','0123456715','NIS015','3514151515100015','AK-015-2010','Laki-laki','Jombang','2010-09-05','2','2','WNI','Islam','081234567015','SDN 3 Jombang','Orang Tua','Motor','BPJS001234581','Jl. KH Wahab Hasbullah','17','005','003','Sengon','Jombang','Jombang','Jawa Timur','61418','Zainul Prayoga','3514151515740015','Pedagang','082345678015','Jombang','1974-07-21','1974','SMA','2700000','Hidup','Luluk Mukarromah','3514151515770015','Ibu Rumah Tangga','083456789015','Jombang','1977-12-09','1977','SMA','0','Hidup'],
];

export async function generateSampleExcel(outputDir) {
	const targetDir = outputDir || path.join(os.homedir(), 'Downloads');
	const outputPath = path.join(targetDir, 'sample_data_siswa.xlsx');

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Data Siswa');

	worksheet.columns = HEADERS.map((header) => ({
		header,
		key: header,
		width: Math.max(18, header.length + 4),
	}));

	const headerRow = worksheet.getRow(1);
	headerRow.height = 28;
	headerRow.eachCell((cell) => {
		cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
		cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B5E20' } };
		cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
		cell.border = {
			top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
			right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
		};
	});

	STUDENTS.forEach((rowValues, index) => {
		const row = worksheet.addRow(rowValues);
		row.height = 20;
		row.eachCell((cell) => {
			cell.alignment = { vertical: 'middle' };
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: index % 2 === 0 ? 'FFF9FBE7' : 'FFFFFFFF' },
			};
		});
	});

	worksheet.views = [{ state: 'frozen', ySplit: 1 }];

	await workbook.xlsx.writeFile(outputPath);
	console.log(`✅ Sample Excel → ${outputPath}`);
	return outputPath;
}

// Allow direct CLI usage: node generateSampleExcel.js
const isMain = process.argv[1] &&
	fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
	generateSampleExcel().catch((error) => {
		console.error('❌ Failed to generate sample Excel:', error);
		process.exit(1);
	});
}
