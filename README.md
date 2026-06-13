# SIAKAD Madrasah

Sistem Informasi Akademik untuk Madrasah - Aplikasi manajemen akademik lengkap untuk mengelola data siswa, guru, penilaian, dan administrasi sekolah.

---

## Tentang Proyek

SIAKAD Madrasah adalah aplikasi berbasis web yang dirancang untuk membantu pengelolaan administrasi akademik di lingkungan Madrasah. Sistem ini mencakup manajemen siklus hidup siswa dari pendaftaran hingga kelulusan, pengelolaan nilai, dan berbagai fitur administratif lainnya.

### Tech Stack

| Layer              | Teknologi                           |
| ------------------ | ----------------------------------- |
| **Frontend**       | SvelteKit, TypeScript, Tailwind CSS |
| **Backend**        | Express.js, Node.js                 |
| **Database**       | SQLite dengan Drizzle ORM           |
| **Authentication** | JWT (JSON Web Token)                |

---

## Fitur Utama

### 1. Manajemen Siswa

- Pendaftaran siswa baru
- Import data siswa via Excel
- Pencarian dan filter siswa
- Detail profil siswa lengkap
- Manajemen status siswa (Aktif, Mutasi, Lulus)

### 2. Siklus Hidup Siswa

- **Kenaikan Kelas** - Promosi siswa ke tingkat berikutnya
- **Kelulusan Massal** - Luluskan siswa kelas akhir secara bulk
- **Mutasi** - Pencatatan siswa pindah/keluar
- **Alumni** - Arsip data siswa yang telah lulus

### 3. Rombongan Belajar (Rombel)

- Pembuatan dan pengelolaan rombel
- Penempatan siswa ke rombel
- Wali kelas assignment
- Kapasitas kelas

### 4. Penilaian & Akademik

- Input nilai per mata pelajaran
- Jenis penilaian (Tugas, UH, UTS, UAS)
- Bobot nilai konfigurable
- Rekap nilai siswa

### 5. Manajemen Guru & Tendik

- Data guru dan tenaga kependidikan
- Penugasan mengajar
- Manajemen akun guru

### 6. Sarana & Prasarana

- Inventaris aset tetap
- Aset lancar
- Perpustakaan

### 7. Tahun Ajaran

- Pengelolaan tahun ajaran
- Aktivasi periode akademik
- Riwayat tahun ajaran

### 8. Administrasi

- Konfirmasi data
- Audit logs (riwayat aktivitas)
- Multi-role (Admin, Guru)

### 9. Navigasi & UX

- Dashboard dengan quick access cards
- Navigasi cepat dari navbar
- Responsive design (mobile-friendly)
- Dokumentasi terintegrasi

---

## Struktur Proyek

```
siakad-madrasah/
├── src/                          # Frontend (SvelteKit)
│   ├── lib/
│   │   ├── components/           # Komponen UI
│   │   │   ├── layout/           # Layout components
│   │   │   ├── modal/            # Modal dialogs
│   │   │   └── icons/            # Icon components
│   │   ├── config/               # Konfigurasi (navigasi, dll)
│   │   └── api.ts                # API helper
│   └── routes/
│       └── (app)/                # Protected routes
│           ├── dashboard/        # Halaman dashboard
│           ├── siswa/            # Manajemen siswa
│           ├── rombel/           # Rombongan belajar
│           ├── score/            # Penilaian
│           ├── gurutendik/       # Guru & Tendik
│           └── Documentations/   # Halaman dokumentasi
│
├── backend/                      # Backend (Express.js)
│   ├── controllers/              # Request handlers
│   ├── services/                 # Business logic
│   ├── routes/api/               # API routes
│   ├── middlewares/              # Middleware (auth, audit, dll)
│   └── db/
│       └── schema/               # Drizzle schema
│
├── docs/                         # Dokumentasi markdown
└── drizzle/                      # Database migrations
```

---

## Instalasi & Menjalankan

### Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau pnpm

### 1. Clone Repository

```bash
git clone <repository-url>
cd siakad-madrasah
```

### 2. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 3. Setup Environment

Buat file `.env` di folder `backend/`:

```env
PORT=3000
DATABASE_URL=./database.sqlite
JWT_SECRET=your-secret-key
FRONTEND_URL_DEV=http://localhost:5173
```

### 4. Jalankan Aplikasi

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Aplikasi akan berjalan di:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## Database Schema

### Tabel Utama

| Tabel             | Deskripsi                                         |
| ----------------- | ------------------------------------------------- |
| `students`        | Data siswa dengan status (ACTIVE/MUTASI/GRADUATE) |
| `rombel`          | Rombongan belajar per tahun ajaran                |
| `rombel_students` | Relasi siswa-rombel dengan flag `isActive`        |
| `student_history` | Riwayat kelulusan/mutasi siswa                    |
| `teachers`        | Data guru dan tenaga kependidikan                 |
| `classes`         | Tingkat kelas (X, XI, XII)                        |
| `subjects`        | Mata pelajaran                                    |
| `class_subject`   | Penugasan mapel per kelas                         |
| `student_scores`  | Nilai siswa                                       |
| `assessment_type` | Jenis penilaian                                   |
| `academic_year`   | Tahun ajaran                                      |

---

## API Endpoints

### Authentication

| Method | Endpoint                  | Deskripsi   |
| ------ | ------------------------- | ----------- |
| POST   | `/routes/api/auth/login`  | Login user  |
| POST   | `/routes/api/auth/logout` | Logout user |

### Siswa

| Method | Endpoint                          | Deskripsi                |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/routes/api/studentDataSet`      | Daftar siswa (paginated) |
| GET    | `/routes/api/students/active`     | Siswa aktif              |
| GET    | `/routes/api/students/graduated`  | Alumni                   |
| GET    | `/routes/api/students/dropout`    | Siswa mutasi             |
| POST   | `/routes/api/students/:id/status` | Ubah status siswa        |

### Promosi & Kelulusan

| Method | Endpoint                        | Deskripsi            |
| ------ | ------------------------------- | -------------------- |
| GET    | `/routes/api/promotion/rombels` | Rombel untuk promosi |
| POST   | `/routes/api/promotion/promote` | Eksekusi promosi     |
| GET    | `/routes/api/graduates/stats`   | Statistik alumni     |

### Tahun Ajaran

| Method | Endpoint                            | Deskripsi           |
| ------ | ----------------------------------- | ------------------- |
| GET    | `/routes/api/academic-years`        | Daftar tahun ajaran |
| GET    | `/routes/api/academic-years/active` | Tahun ajaran aktif  |

---

## Alur Kerja Sistem

### Siklus Hidup Siswa

```
PENDAFTARAN
     │
     ▼
┌─────────┐
│ ACTIVE  │ ← Siswa aktif dalam rombel
└────┬────┘
     │
     ├──────────────┬──────────────┐
     ▼              ▼              ▼
┌─────────┐   ┌─────────┐   ┌──────────┐
│ PROMOSI │   │ MUTASI  │   │ GRADUATE │
│ (Naik   │   │ (Pindah/│   │ (Lulus)  │
│  Kelas) │   │  Keluar)│   │          │
└────┬────┘   └─────────┘   └──────────┘
     │              │              │
     ▼              ▼              ▼
  Tetap          Final          Final
  ACTIVE         State          State
```

---

## Screenshots

> _Screenshots akan ditambahkan_

---

## Kontributor

Proyek ini dikembangkan sebagai tugas Semester 7.

---

## Lisensi

Proyek ini dibuat untuk keperluan pendidikan.

---

## Dokumentasi Lengkap

Dokumentasi lengkap tersedia di dalam aplikasi melalui menu **Dokumentasi** atau akses langsung ke `/Documentations`.

File dokumentasi tersimpan di folder `docs/` dalam format Markdown.

```
siakad-madrasah
├─ .npmrc
├─ .prettierignore
├─ .prettierrc
├─ API_DOCUMENTATION.md
├─ API_JSON_PAYLOAD.md
├─ backend
│  ├─ afterPack.cjs
│  ├─ app.js
│  ├─ BACKEND_README.md
│  ├─ drizzle
│  │  ├─ 0000_tense_celestials.sql
│  │  ├─ 0001_dark_puff_adder.sql
│  │  ├─ 0002_wooden_galactus.sql
│  │  ├─ 0003_exotic_wallflower.sql
│  │  ├─ 0004_outgoing_vindicator.sql
│  │  ├─ 0005_next_carmella_unuscione.sql
│  │  ├─ 0006_ambiguous_hobgoblin.sql
│  │  ├─ 0007_optimal_stone_men.sql
│  │  ├─ 0008_overconfident_santa_claus.sql
│  │  ├─ 0009_wide_sharon_ventura.sql
│  │  ├─ 0010_fluffy_preak.sql
│  │  └─ meta
│  │     ├─ 0000_snapshot.json
│  │     ├─ 0001_snapshot.json
│  │     ├─ 0002_snapshot.json
│  │     ├─ 0003_snapshot.json
│  │     ├─ 0004_snapshot.json
│  │     ├─ 0005_snapshot.json
│  │     ├─ 0006_snapshot.json
│  │     ├─ 0007_snapshot.json
│  │     ├─ 0008_snapshot.json
│  │     ├─ 0009_snapshot.json
│  │     ├─ 0010_snapshot.json
│  │     └─ _journal.json
│  ├─ drizzle.config.js
│  ├─ electron
│  │  ├─ main.js
│  │  └─ preload.cjs
│  ├─ electron-builder.json
│  ├─ jest.config.js
│  ├─ package.json
│  ├─ public
│  │  └─ upload
│  │     ├─ imageSch
│  │     │  ├─ aset
│  │     │  ├─ asrama
│  │     │  ├─ canteen
│  │     │  │  ├─ 2212559803.webp
│  │     │  │  └─ kantin-1024x767-1.jpg
│  │     │  ├─ certification
│  │     │  ├─ gedung
│  │     │  ├─ kamar_mandi
│  │     │  ├─ kantor
│  │     │  ├─ kelas
│  │     │  ├─ lab
│  │     │  │  ├─ lab_Ipa
│  │     │  │  ├─ lab_komputer
│  │     │  │  │  └─ images.webp
│  │     │  │  └─ lab_multimedia
│  │     │  ├─ lapangan
│  │     │  ├─ masjid
│  │     │  └─ parking_lot
│  │     ├─ Profile
│  │     │  ├─ accountAdminProfile
│  │     │  ├─ studentProfile
│  │     │  │  └─ student_1_1779957637926.png
│  │     │  └─ teacherProfile
│  │     └─ profilesch
│  │        ├─ logo.jpg
│  │        └─ logo.png
│  └─ src
│     ├─ controllers
│     │  ├─ academicYearController.js
│     │  ├─ assessmentController.js
│     │  ├─ authController.js
│     │  ├─ classdataController.js
│     │  ├─ classSubjectController.js
│     │  ├─ curriculumController.js
│     │  ├─ graduateController.js
│     │  ├─ promotionController.js
│     │  ├─ rombelController.js
│     │  ├─ schoolController.js
│     │  ├─ scoreController.js
│     │  ├─ studentController.js
│     │  ├─ subjectController.js
│     │  └─ teacherController.js
│     ├─ db
│     │  ├─ index.js
│     │  ├─ schema
│     │  │  ├─ academicYear.js
│     │  │  ├─ assesmentType.js
│     │  │  ├─ auditlog.js
│     │  │  ├─ classesDataTable.js
│     │  │  ├─ classesSubjectTable.js
│     │  │  ├─ classGroup.js
│     │  │  ├─ classSchoolData
│     │  │  ├─ curriculum.js
│     │  │  ├─ relations.js
│     │  │  ├─ rombelStudents.js
│     │  │  ├─ schoolAddress.js
│     │  │  ├─ schooldataTable.js
│     │  │  ├─ schoolFacilities.js
│     │  │  ├─ scoreStudentData
│     │  │  ├─ studentActivestatus.js
│     │  │  ├─ studentAddress.js
│     │  │  ├─ studentAttendance.js
│     │  │  ├─ studentClass.js
│     │  │  ├─ studentFather.js
│     │  │  ├─ studentHistory.js
│     │  │  ├─ studentMother.js
│     │  │  ├─ studentScore.js
│     │  │  ├─ studentsdataTable.js
│     │  │  ├─ studentWali.js
│     │  │  ├─ subjectTable.js
│     │  │  ├─ teacherUser.js
│     │  │  └─ user.js
│     │  ├─ seed.js
│     │  ├─ seedManager.js
│     │  └─ seedscore.js
│     ├─ middlewares
│     │  ├─ globalRatelimit
│     │  │  └─ rateLimiter.js
│     │  ├─ middlewareAudit.js
│     │  ├─ throttleFeat
│     │  │  └─ throttleLimit.js
│     │  └─ verifyToken.js
│     ├─ public
│     │  └─ upload
│     │     └─ profilesch
│     │        └─ logo.png
│     ├─ routes
│     │  ├─ api
│     │  │  ├─ academicYear.js
│     │  │  ├─ assessmentType.js
│     │  │  ├─ auth.js
│     │  │  ├─ classData.js
│     │  │  ├─ classSubject.js
│     │  │  ├─ curriculum.js
│     │  │  ├─ graduate.js
│     │  │  ├─ promotion.js
│     │  │  ├─ rombel.js
│     │  │  ├─ schooldataNav.js
│     │  │  ├─ scores.js
│     │  │  ├─ student.js
│     │  │  ├─ subject.js
│     │  │  └─ teacher.js
│     │  └─ auditLog
│     │     └─ audit_logs.js
│     ├─ services
│     │  ├─ academicYear.services.js
│     │  ├─ assesment.services.js
│     │  ├─ auth.service.js
│     │  ├─ classData.services.js
│     │  ├─ classSubject.service.js
│     │  ├─ curriculum.services.js
│     │  ├─ graduate.services.js
│     │  ├─ promotion.services.js
│     │  ├─ rombel.services.js
│     │  ├─ schoolData.service.js
│     │  ├─ score.services.js
│     │  ├─ student.service.js
│     │  ├─ subject.services.js
│     │  └─ teacher.services.js
│     └─ utils
│        ├─ passwordGenerator
│        │  └─ bcrypt.js
│        ├─ seedFile
│        │  ├─ seed.js
│        │  ├─ seedAcademicCore.js
│        │  ├─ seedAcademicYear.js
│        │  ├─ seedAuth.js
│        │  ├─ seedClasses.js
│        │  ├─ seedClassesAuto.js
│        │  ├─ seedFresh.js
│        │  ├─ seedMapelKurikulum.js
│        │  ├─ seedRombelSync.js
│        │  ├─ seedSchool.js
│        │  ├─ seedStudentFull.js
│        │  ├─ seedStudentPerformance.js
│        │  ├─ seedSyncAcademic.js
│        │  └─ seedTeacher.js
│        └─ unit_test
│           ├─ rombel.services.test.js
│           ├─ score.services.test.js
│           ├─ student.bulk_upload.test.js
│           └─ student.payload.test.js
├─ CLASS_DIAGRAM_PLANTUML.md
├─ docs
│  ├─ 01-ARCHITECTURE.md
│  ├─ 02-DATABASE.md
│  ├─ 03-API.md
│  ├─ 04-COMPONENTS.md
│  ├─ 05-FEATURES.md
│  ├─ 06-DEVELOPMENT.md
│  ├─ database_schema.sql
│  └─ _archive
│     ├─ academicyeardocs.md
│     ├─ assesmentdocs.md
│     ├─ assesmentservicedocs.md
│     ├─ classdatadocumentation.md
│     ├─ claudeOpusexec.md
│     ├─ dokumentasi.md
│     ├─ drizzle_explain.md
│     ├─ excelbulkInputplan.md
│     ├─ fontstyle.md
│     ├─ functions.md
│     ├─ inputboxwhy.md
│     ├─ modal.md
│     ├─ modalpopupalert.md
│     ├─ numberinputonly.md
│     ├─ refactoredschoolcontroller.md
│     ├─ rombelfeat.md
│     ├─ scoresdocs.md
│     ├─ studentdatadocs.md
│     ├─ studentexcel.md
│     ├─ studentfilterservice.md
│     ├─ studentsdata.md
│     ├─ testscore.md
│     ├─ TODO.md
│     ├─ translations_table.md
│     ├─ whyhardcodedtable.md
│     └─ whynotputpatchHTTP.md
├─ eslint.config.js
├─ GEMINI.md
├─ imageresearch
│  ├─ bab-4
│  │  ├─ Screenshot (100).png
│  │  ├─ Screenshot (101).png
│  │  ├─ Screenshot (102).png
│  │  ├─ Screenshot (103).png
│  │  ├─ Screenshot (89).png
│  │  ├─ Screenshot (90).png
│  │  ├─ Screenshot (91).png
│  │  ├─ Screenshot (92).png
│  │  ├─ Screenshot (93).png
│  │  ├─ Screenshot (94).png
│  │  ├─ Screenshot (95).png
│  │  ├─ Screenshot (96).png
│  │  ├─ Screenshot (97).png
│  │  ├─ Screenshot (98).png
│  │  ├─ Screenshot (99).png
│  │  ├─ Screenshot 2026-04-12 160107.png
│  │  ├─ Screenshot 2026-04-12 160131.png
│  │  ├─ Screenshot 2026-04-12 160214.png
│  │  ├─ Screenshot 2026-04-12 160228.png
│  │  ├─ Screenshot 2026-04-12 160243.png
│  │  ├─ Screenshot 2026-04-12 160259.png
│  │  ├─ Screenshot 2026-04-12 160312.png
│  │  ├─ Screenshot 2026-04-12 160400.png
│  │  ├─ Screenshot 2026-04-12 160415.png
│  │  ├─ Screenshot 2026-04-12 160426.png
│  │  ├─ Screenshot 2026-04-12 160501.png
│  │  ├─ Screenshot 2026-04-12 160513.png
│  │  ├─ Screenshot 2026-04-12 160523.png
│  │  ├─ Screenshot 2026-04-12 160543.png
│  │  ├─ Screenshot 2026-04-12 160552.png
│  │  ├─ Screenshot 2026-04-12 160627.png
│  │  └─ Screenshot 2026-04-12 160922.png
│  ├─ chart-grafik-iterasi.png
│  ├─ deploymentdiagram.png
│  ├─ git-distrib.png
│  ├─ imagea11y.png
│  ├─ testingdiffcomparison.png
│  ├─ use-case-diagram-siakad-sekolah-rev.png
│  ├─ use-case-diagram-siakad-sekolahv3.png
│  └─ XP.png
├─ JOURNALS.md
├─ package.json
├─ pnpm-workspace.yaml
├─ README.md
├─ RELEASE_REPORT.md
├─ RESEARCHREPORT.md
├─ RESEARCHREPORT1.md
├─ RESEARCHREPORTCHAPT2.md
├─ RESEARCHREPORTCHAPTERIV.md
├─ src
│  ├─ app.css
│  ├─ app.d.ts
│  ├─ app.html
│  ├─ lib
│  │  ├─ api.ts
│  │  ├─ assets
│  │  │  ├─ favicon.svg
│  │  │  └─ siakadLogo.svg
│  │  ├─ components
│  │  │  ├─ features
│  │  │  │  ├─ audit
│  │  │  │  │  ├─ AuditFilters.svelte
│  │  │  │  │  ├─ AuditLogs.svelte
│  │  │  │  │  └─ AuditTable.svelte
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ Calendar.svelte
│  │  │  │  │  ├─ DashboardLandsort.svelte
│  │  │  │  │  ├─ NavigationCards.svelte
│  │  │  │  │  ├─ SchoolProperties.svelte
│  │  │  │  │  └─ StatCard.svelte
│  │  │  │  ├─ navigation
│  │  │  │  │  └─ NavigationScreen.svelte
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ ChangePassword.svelte
│  │  │  │  │  ├─ ChangeUsername.svelte
│  │  │  │  │  └─ PassIndicatorStrength.svelte
│  │  │  │  ├─ scores
│  │  │  │  │  └─ StudentScoreTable.svelte
│  │  │  │  ├─ student
│  │  │  │  │  └─ ParentBiodata.svelte
│  │  │  │  └─ upload
│  │  │  │     └─ UploadExcel.svelte
│  │  │  ├─ icons
│  │  │  │  ├─ addIcon.svelte
│  │  │  │  ├─ arrow_left.svelte
│  │  │  │  ├─ arrow_up.svelte
│  │  │  │  ├─ checkIcon.svelte
│  │  │  │  ├─ crossIcon.svelte
│  │  │  │  ├─ DashboardIcon.svelte
│  │  │  │  ├─ deleteIcon.svelte
│  │  │  │  ├─ downloadIcon.svelte
│  │  │  │  ├─ editIcon.svelte
│  │  │  │  ├─ errorIcon.svelte
│  │  │  │  ├─ EyeIcon.svelte
│  │  │  │  ├─ graduateIcon.svelte
│  │  │  │  ├─ more.svelte
│  │  │  │  ├─ mutationIcon.svelte
│  │  │  │  ├─ sort.svelte
│  │  │  │  ├─ success.svelte
│  │  │  │  ├─ uploadIcon.svelte
│  │  │  │  └─ warningIcon.svelte
│  │  │  ├─ input
│  │  │  │  ├─ inputMapel.svelte
│  │  │  │  └─ PhoneInput.svelte
│  │  │  ├─ layout
│  │  │  │  ├─ Navbar.svelte
│  │  │  │  └─ Sidebar.svelte
│  │  │  ├─ modal
│  │  │  │  ├─ GraduateModal.svelte
│  │  │  │  ├─ modalalert.svelte
│  │  │  │  ├─ modalexam.svelte
│  │  │  │  ├─ MutasiModal.svelte
│  │  │  │  ├─ RombelAddStudentPanel.svelte
│  │  │  │  ├─ RombelEditModal.svelte
│  │  │  │  └─ SubjectSelectModal.svelte
│  │  │  └─ ui
│  │  │     └─ PendingScreen.svelte
│  │  ├─ config
│  │  │  ├─ navigation.ts
│  │  │  └─ navigation_short.ts
│  │  ├─ data
│  │  │  ├─ countryCodes.ts
│  │  │  └─ navigationCategories.ts
│  │  ├─ fonts
│  │  │  ├─ inter-font
│  │  │  │  ├─ Inter-Black.woff2
│  │  │  │  ├─ Inter-BlackItalic.woff2
│  │  │  │  ├─ Inter-Bold.woff2
│  │  │  │  ├─ Inter-BoldItalic.woff2
│  │  │  │  ├─ Inter-ExtraBold.woff2
│  │  │  │  ├─ Inter-ExtraBoldItalic.woff2
│  │  │  │  ├─ Inter-ExtraLight.woff2
│  │  │  │  ├─ Inter-ExtraLightItalic.woff2
│  │  │  │  ├─ Inter-Italic.woff2
│  │  │  │  ├─ Inter-Light.woff2
│  │  │  │  ├─ Inter-LightItalic.woff2
│  │  │  │  ├─ Inter-Medium.woff2
│  │  │  │  ├─ Inter-MediumItalic.woff2
│  │  │  │  ├─ Inter-Regular.woff2
│  │  │  │  ├─ Inter-SemiBold.woff2
│  │  │  │  ├─ Inter-SemiBoldItalic.woff2
│  │  │  │  ├─ Inter-Thin.woff2
│  │  │  │  ├─ Inter-ThinItalic.woff2
│  │  │  │  ├─ InterDisplay-Black.woff2
│  │  │  │  ├─ InterDisplay-BlackItalic.woff2
│  │  │  │  ├─ InterDisplay-Bold.woff2
│  │  │  │  ├─ InterDisplay-BoldItalic.woff2
│  │  │  │  ├─ InterDisplay-ExtraBold.woff2
│  │  │  │  ├─ InterDisplay-ExtraBoldItalic.woff2
│  │  │  │  ├─ InterDisplay-ExtraLight.woff2
│  │  │  │  ├─ InterDisplay-ExtraLightItalic.woff2
│  │  │  │  ├─ InterDisplay-Italic.woff2
│  │  │  │  ├─ InterDisplay-Light.woff2
│  │  │  │  ├─ InterDisplay-LightItalic.woff2
│  │  │  │  ├─ InterDisplay-Medium.woff2
│  │  │  │  ├─ InterDisplay-MediumItalic.woff2
│  │  │  │  ├─ InterDisplay-Regular.woff2
│  │  │  │  ├─ InterDisplay-SemiBold.woff2
│  │  │  │  ├─ InterDisplay-SemiBoldItalic.woff2
│  │  │  │  ├─ InterDisplay-Thin.woff2
│  │  │  │  ├─ InterDisplay-ThinItalic.woff2
│  │  │  │  ├─ InterVariable-Italic.woff2
│  │  │  │  ├─ InterVariable.ttf
│  │  │  │  └─ InterVariable.woff2
│  │  │  ├─ monospace_fonts
│  │  │  │  ├─ JetBrainsMono-Bold.woff2
│  │  │  │  ├─ JetBrainsMono-BoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraBold.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraBoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraLight.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraLightItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Italic.woff2
│  │  │  │  ├─ JetBrainsMono-Light.woff2
│  │  │  │  ├─ JetBrainsMono-LightItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Medium.woff2
│  │  │  │  ├─ JetBrainsMono-MediumItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Regular.woff2
│  │  │  │  ├─ JetBrainsMono-SemiBold.woff2
│  │  │  │  ├─ JetBrainsMono-SemiBoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Thin.woff2
│  │  │  │  └─ JetBrainsMono-ThinItalic.woff2
│  │  │  └─ StackSans-fonts
│  │  │     ├─ StackSansText-Bold.woff2
│  │  │     ├─ StackSansText-ExtraLight.woff2
│  │  │     ├─ StackSansText-Light.woff2
│  │  │     ├─ StackSansText-Medium.woff2
│  │  │     ├─ StackSansText-Regular.woff2
│  │  │     └─ StackSansText-SemiBold.woff2
│  │  ├─ image
│  │  │  ├─ pattern-randomized.svg
│  │  │  └─ topography.svg
│  │  ├─ index.ts
│  │  ├─ services
│  │  │  └─ auditService.ts
│  │  ├─ stores.ts
│  │  └─ types
│  │     └─ navigation.ts
│  └─ routes
│     ├─ (app)
│     │  ├─ +layout.svelte
│     │  ├─ admin
│     │  │  └─ profile
│     │  │     └─ +page.svelte
│     │  ├─ confirm
│     │  │  ├─ lembaga
│     │  │  │  └─ +page.svelte
│     │  │  ├─ sarpras
│     │  │  │  └─ +page.svelte
│     │  │  ├─ studentdata
│     │  │  │  └─ +page.svelte
│     │  │  └─ teacher
│     │  │     └─ +page.svelte
│     │  ├─ dashboard
│     │  │  └─ +page.svelte
│     │  ├─ Documentations
│     │  │  ├─ +page.server.ts
│     │  │  └─ +page.svelte
│     │  ├─ gurutendik
│     │  │  ├─ ajuan-gtk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ akun
│     │  │  │  └─ +page.svelte
│     │  │  ├─ daftar-gtk
│     │  │  │  └─ +page.svelte
│     │  │  └─ mutasi
│     │  │     └─ +page.svelte
│     │  ├─ info
│     │  │  ├─ academicyear
│     │  │  │  └─ +page.svelte
│     │  │  ├─ curriculum
│     │  │  │  └─ +page.svelte
│     │  │  └─ daysch
│     │  │     └─ +page.svelte
│     │  ├─ lembaga
│     │  │  └─ +page.svelte
│     │  ├─ rombel
│     │  │  ├─ +page.svelte
│     │  │  ├─ addrombel
│     │  │  │  └─ +page.svelte
│     │  │  └─ detailrombel
│     │  │     └─ [id]
│     │  │        └─ +page.svelte
│     │  ├─ sarpras
│     │  │  ├─ asetlancar
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  ├─ assettetap
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  └─ perpustakaan
│     │  │     ├─ +page.svelte
│     │  │     └─ [id]
│     │  │        └─ +page.svelte
│     │  ├─ score
│     │  │  ├─ +page.svelte
│     │  │  ├─ exam
│     │  │  │  └─ +page.svelte
│     │  │  ├─ exammanagement
│     │  │  │  └─ +page.svelte
│     │  │  ├─ subject
│     │  │  │  └─ +page.svelte
│     │  │  ├─ task
│     │  │  │  └─ +page.svelte
│     │  │  └─ upgrade
│     │  │     └─ +page.svelte
│     │  ├─ siswa
│     │  │  ├─ +page.svelte
│     │  │  ├─ addStudent
│     │  │  │  └─ +page.svelte
│     │  │  ├─ alumni
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  ├─ beasiswa
│     │  │  │  └─ +page.svelte
│     │  │  ├─ graduate-bulk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ Kelas
│     │  │  │  └─ +page.svelte
│     │  │  ├─ mutasi
│     │  │  │  └─ +page.svelte
│     │  │  ├─ mutasi-masuk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ siswa-ganda
│     │  │  │  └─ +page.svelte
│     │  │  └─ [id]
│     │  │     ├─ +page.svelte
│     │  │     └─ edit
│     │  │        └─ +page.svelte
│     │  └─ support
│     │     └─ +page.svelte
│     ├─ (public)
│     │  └─ login
│     │     └─ +page.svelte
│     ├─ +error.svelte
│     ├─ +layout.svelte
│     └─ +page.svelte
├─ static
│  ├─ favicon.svg
│  └─ robots.txt
├─ svelte.config.js
├─ tsconfig.json
└─ vite.config.ts

```