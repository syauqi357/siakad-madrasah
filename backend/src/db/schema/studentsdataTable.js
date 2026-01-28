import { sqliteTable, text, int, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { rombel } from './classGroup.js'; // CORRECTED IMPORT

export const studentTable = sqliteTable(
	'student',
	{
		id: int('id').primaryKey({ autoIncrement: true }),
		studentName: text('student_name').notNull(),
		nisn: int('nisn').notNull().unique(),
		localNis: int('local_nis').unique(),
		gender: text('gender', { enum: ['laki-laki', 'Perempuan'] }),
		religion: text('religion'),
		birthPlace: text('birth_place'),
		birthDate: text('birth_date'), // SQLite stores dates as text
		previousSchool: text('previous_school'),
		phoneNumber: text('phone_number'),
		childOrder: int('child_order'), // anak ke-berapa
		siblingsCount: int('siblings_count'),
		originRegion: text('origin_region'),
		bpjs: text('bpjs'), // health insurance number
		idCardNumber: text('id_card_number'), // KTP
		birthCertificateNumber: text('birth_certificate_number'), // akta
		nationality: text('nationality').default('Indonesia'),
		livingWith: text('living_with'), // tinggal bersama
		transportation: text('transportation'),
		profilePhoto: text('profile_photo'),

		// --- FIXED: Copied from correct rombel reference ---
		rombelId: int('rombel_id').references(() => rombel.id), // References rombel table (classGroup.js)

		createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		nisnIdx: index('idx_students_nisn').on(table.nisn),
		studentNameIdx: index('idx_students_student_name').on(table.studentName),
		localNisIdx: index('idx_students_local_nis').on(table.localNis)
	})
);

// nisnIdx: index('idx_students_nisn').on(table.nisn),

/**
 * 
 * 
 * npx drizzle-kit push
No config path provided, using default 'drizzle.config.js'
Reading config file 'G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\drizzle.config.js'
[✓] Pulling schema from database...
LibsqlError: SQLITE_ERROR: index unique_student_assessment already exists
    at mapSqliteError (file:///G:/01%20-%20KULIAH/SEMESTER%207/SIAKAD-MADRASAH/siakad-madrasah/backend/node_modules/@libsql/client/lib-esm/sqlite3.js:392:16)
    at executeStmt (file:///G:/01%20-%20KULIAH/SEMESTER%207/SIAKAD-MADRASAH/siakad-madrasah/backend/node_modules/@libsql/client/lib-esm/sqlite3.js:297:15)
    at Sqlite3Client.execute (file:///G:/01%20-%20KULIAH/SEMESTER%207/SIAKAD-MADRASAH/siakad-madrasah/backend/node_modules/@libsql/client/lib-esm/sqlite3.js:81:16)
    ... 4 lines matching cause stack trace ...
    at async run (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\drizzle-kit\bin.cjs:93117:7) {
  code: 'SQLITE_ERROR',
  rawCode: 1,
  [cause]: SqliteError: index unique_student_assessment already exists
      at convertError (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\libsql\index.js:59:12) 
      at Database.prepare (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\libsql\index.js:131:13)
      at executeStmt (file:///G:/01%20-%20KULIAH/SEMESTER%207/SIAKAD-MADRASAH/siakad-madrasah/backend/node_modules/@libsql/client/lib-esm/sqlite3.js:268:28)
      at Sqlite3Client.execute (file:///G:/01%20-%20KULIAH/SEMESTER%207/SIAKAD-MADRASAH/siakad-madrasah/backend/node_modules/@libsql/client/lib-esm/sqlite3.js:81:16)
      at Object.run (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\drizzle-kit\bin.cjs:81263:26)
      at sqlitePush (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\drizzle-kit\bin.cjs:84519:24)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.handler (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\drizzle-kit\bin.cjs:93884:9)
      at async run (G:\01 - KULIAH\SEMESTER 7\SIAKAD-MADRASAH\siakad-madrasah\backend\node_modules\drizzle-kit\bin.cjs:93117:7) {
    code: 'SQLITE_ERROR',
    rawCode: 1
  }
}
 * 
 * 
*/
