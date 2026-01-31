## Translation reference:

| Indonesian      | English                  |
| --------------- | ------------------------ |
| siswa           | students (table name)    |
| nama_siswa      | student_name             |
| jenis_kelamin   | gender                   |
| laki-laki       | male                     |
| perempuan       | female                   |
| agama           | religion                 |
| tempat_lahir    | birth_place              |
| tanggal_lahir   | birth_date               |
| asal_sekolah    | previous_school          |
| nomor_hp        | phone_number             |
| anak_ke         | child_order              |
| jumlah_saudara  | siblings_count           |
| asal_daerah     | origin_region            |
| nomor_ktp       | id_card_number           |
| nomor_akta      | birth_certificate_number |
| kewarganegaraan | nationality              |
| tinggal_bersama | living_with              |
| transportasi    | transportation           |
| foto_profil     | profile_photo            |

---

## PostgreSQL version (English):

```javascript
import { pgTable, text, serial, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const studentTable = pgTable(
	'students',
	{
		id: serial('id').primaryKey(),
		studentName: text('student_name').notNull(),
		nisn: integer('nisn').notNull().unique(),
		localNis: integer('local_nis').unique(),
		gender: text('gender', { enum: ['male', 'female'] }),
		religion: text('religion'),
		birthPlace: text('birth_place'),
		birthDate: timestamp('birth_date'), // PostgreSQL proper date type
		previousSchool: text('previous_school'),
		phoneNumber: text('phone_number'),
		childOrder: integer('child_order'),
		siblingsCount: integer('siblings_count'),
		originRegion: text('origin_region'),
		bpjs: text('bpjs'),
		idCardNumber: text('id_card_number'),
		birthCertificateNumber: text('birth_certificate_number'),
		nationality: text('nationality').default('Indonesia'),
		livingWith: text('living_with'),
		transportation: text('transportation'),
		profilePhoto: text('profile_photo'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => ({
		nisnIdx: index('idx_students_nisn').on(table.nisn),
		localNisIdx: index('idx_students_local_nis').on(table.localNis)
	})
);
```

#### claudeAi generated

---

# studentAddress table

| Indonesian Column | English Column | Description                |
| ----------------- | -------------- | -------------------------- |
| id                | id             | Primary key                |
| siswa_id          | student_id     | Reference to student table |
| provinsi          | province       | Province                   |
| kabupaten         | regency        | Regency / City             |
| kecamatan         | district       | District                   |
| kelurahan         | sub_district   | Urban village              |
| desa              | village        | Rural village              |
| dusun             | hamlet         | Hamlet                     |
| jalan             | street         | Street name                |
| no_rumah          | house_number   | House number               |
| rt                | rt             | Neighborhood unit          |
| rw                | rw             | Community unit             |
| kode_pos          | postal_code    | Postal code                |

# studentFather table EN - ID

| Indonesian Column    | English Column | Description                |
| -------------------- | -------------- | -------------------------- |
| id                   | id             | Primary key                |
| siswa_id             | student_id     | Reference to student table |
| nik                  | nik            | National ID number         |
| nama                 | name           | Father's name              |
| tempat_lahir         | birth_place    | Place of birth             |
| tanggal_lahir        | birth_date     | Date of birth              |
| tahun_lahir          | birth_year     | Year of birth              |
| pendidikan           | education      | Education level            |
| pekerjaan            | occupation     | Job                        |
| penghasilan_perbulan | monthly_income | Monthly income             |
| nomor_hp             | phone_number   | Phone number               |
| status_hidup         | is_alive       | Living status (1 = alive)  |
