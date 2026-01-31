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
