# Dokumentasi Sistem Manajemen Siklus Hidup Siswa

## Daftar Isi
1. [Gambaran Umum](#gambaran-umum)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Siklus Hidup Siswa](#siklus-hidup-siswa)
4. [Fitur-Fitur Utama](#fitur-fitur-utama)
5. [Model Konkurensi & Async](#model-konkurensi--async)
6. [Struktur Database](#struktur-database)
7. [API Endpoints](#api-endpoints)
8. [Alur Kerja Sistem](#alur-kerja-sistem)

---

## Gambaran Umum

Sistem SIAKAD Madrasah adalah aplikasi manajemen akademik yang mengelola siklus hidup siswa dari pendaftaran hingga kelulusan atau mutasi. Sistem ini dibangun menggunakan:

- **Frontend**: SvelteKit dengan TypeScript
- **Backend**: Express.js dengan Node.js
- **Database**: SQLite dengan Drizzle ORM
- **Styling**: Tailwind CSS

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (SvelteKit)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Dashboard  │  │   Siswa     │  │   Penilaian         │  │
│  │  - Cards    │  │   - Daftar  │  │   - Input Nilai     │  │
│  │  - Navigasi │  │   - Alumni  │  │   - Kenaikan Kelas  │  │
│  │             │  │   - Mutasi  │  │   - Mata Pelajaran  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request (Async/Await)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │→ │ Controllers │→ │     Services        │  │
│  │             │  │             │  │  (Business Logic)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                              │              │
│                                              ▼              │
│                              ┌─────────────────────────┐    │
│                              │    Drizzle ORM          │    │
│                              │  (Query Builder)        │    │
│                              └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                      │
│  students | rombel | rombel_students | student_history      │
└─────────────────────────────────────────────────────────────┘
```

---

## Siklus Hidup Siswa

### Diagram Status Siswa

```
                    ┌──────────────┐
                    │  PENDAFTARAN │
                    │  (Input Data)│
                    └──────┬───────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    STATUS: ACTIVE                            │
│                                                              │
│   Siswa aktif dalam rombongan belajar (rombel)               │
│   - Dapat mengikuti pelajaran                                │
│   - Dapat menerima nilai                                     │
│   - Dapat dipromosikan ke kelas berikutnya                   │
│                                                              │
└──────────────────────┬───────────────────┬───────────────────┘
                       │                   │
          ┌────────────┴────┐         ┌────┴────────────┐
          │                 │         │                 │
          ▼                 ▼         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ KENAIKAN KELAS  │  │ STATUS: MUTASI  │  │ STATUS: GRADUATE    │
│                 │  │                 │  │                     │
│ - Pindah rombel │  │ - Pindah sekolah│  │ - Lulus sekolah     │
│ - Tetap ACTIVE  │  │ - Keluar        │  │ - Tamat pendidikan  │
│ - Tahun ajaran  │  │ - Ada alasan    │  │ - Ada ijazah        │
│   baru          │  │                 │  │                     │
└────────┬────────┘  └─────────────────┘  └─────────────────────┘
         │                   │                     │
         │                   │                     │
         ▼                   ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ Kembali ke      │  │ FINAL STATE    │  │ FINAL STATE         │
│ STATUS: ACTIVE  │  │                 │  │                     │
│ di rombel baru  │  │ Tidak dapat    │  │ Tidak dapat         │
│                 │  │ dikembalikan   │  │ dikembalikan        │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
```

### Penjelasan Status

| Status | Deskripsi | Aksi yang Tersedia |
|--------|-----------|-------------------|
| **ACTIVE** | Siswa aktif dalam rombel | Promosi, Mutasi, Kelulusan |
| **MUTASI** | Siswa pindah/keluar sekolah | Lihat riwayat saja |
| **GRADUATE** | Siswa telah lulus | Lihat riwayat & ijazah |

---

## Fitur-Fitur Utama

### 1. Manajemen Siswa
- **Daftar Siswa**: Menampilkan semua siswa dengan filter status
- **Tambah Siswa**: Input data siswa baru
- **Import Excel**: Upload data siswa secara massal
- **Detail Siswa**: Informasi lengkap per siswa

### 2. Kenaikan Kelas (Grade Promotion)
**Lokasi**: `/score/upgrade`

Fitur untuk memindahkan siswa ke kelas/rombel berikutnya:
- Pilih rombel asal
- Pilih siswa yang akan dipromosikan
- Pilih rombel tujuan
- Eksekusi promosi secara transaksional

### 3. Kelulusan (Graduation)
**Lokasi**: `/siswa/graduate-bulk`

Fitur untuk meluluskan siswa kelas akhir:
- Pilih rombel kelas akhir (XII/IX)
- Pilih siswa (bisa multiple)
- Input data kelulusan:
  - Tahun kelulusan
  - Tanggal kelulusan
  - Nomor ijazah (opsional)
  - Predikat (opsional)

### 4. Alumni
**Lokasi**: `/siswa/alumni`

Menampilkan daftar siswa yang telah lulus:
- Filter berdasarkan tahun
- Statistik per tahun kelulusan
- Detail ijazah dan predikat

### 5. Mutasi
**Lokasi**: `/siswa/mutasi`

Menampilkan daftar siswa yang telah mutasi/pindah:
- Tanggal mutasi
- Alasan mutasi
- Kelas terakhir

### 6. Navigasi Cepat
- **Dashboard Cards**: Kartu navigasi di halaman dashboard
- **Navbar Menu**: Modal navigasi dari navbar (tombol "Menu")

---

## Model Konkurensi & Async

### Frontend: Asynchronous Pattern

Sistem menggunakan **async/await** pattern untuk semua operasi I/O:

```typescript
// Contoh: Fetch data siswa dengan async/await
async function fetchStudents(page: number) {
    loading = true;
    try {
        const response = await API_FETCH(`/routes/api/studentDataSet?page=${page}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        students = result.data || [];
    } catch (error) {
        console.error('Failed to fetch:', error);
    } finally {
        loading = false;
    }
}
```

### Backend: Non-Blocking I/O

Express.js menggunakan **event-driven, non-blocking I/O** model:

```javascript
// Controller menggunakan async handler
export const getAll = async (req, res) => {
    try {
        const data = await studentService.getAllStudents();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

### Database: Transaksi untuk Konsistensi Data

Operasi kritis menggunakan **database transaction** untuk menjaga konsistensi:

```javascript
// Contoh: Promosi siswa dengan transaksi
export function promoteStudents(promotions, targetRombelId) {
    return db.transaction((tx) => {
        for (const p of promotions) {
            // 1. Nonaktifkan assignment lama
            tx.update(rombelStudents)
                .set({ isActive: false, leftAt: new Date().toISOString() })
                .where(and(
                    eq(rombelStudents.studentId, p.studentId),
                    eq(rombelStudents.isActive, true)
                ))
                .run();

            // 2. Buat assignment baru
            tx.insert(rombelStudents)
                .values({
                    rombelId: targetRombelId,
                    studentId: p.studentId,
                    isActive: true
                })
                .run();
        }
        return { success: true };
    });
}
```

### Keuntungan Model Async:

1. **Non-Blocking**: UI tetap responsif saat menunggu data
2. **Skalabilitas**: Server dapat menangani banyak request bersamaan
3. **Error Handling**: Try-catch pattern untuk penanganan error yang bersih
4. **Loading States**: Indikator loading untuk UX yang baik

---

## Struktur Database

### Tabel Utama

#### 1. `students`
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    nisn TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT,
    birthDate TEXT,
    birthPlace TEXT,
    religion TEXT,
    originRegion TEXT,
    status TEXT DEFAULT 'ACTIVE',  -- ACTIVE | MUTASI | GRADUATE
    createdAt TEXT,
    updatedAt TEXT
);
```

#### 2. `rombel` (Rombongan Belajar)
```sql
CREATE TABLE rombel (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    classId INTEGER REFERENCES classes(id),
    academicYearId INTEGER REFERENCES academic_year(id),
    classAdvisorId INTEGER REFERENCES teachers(id),
    studentCapacity INTEGER
);
```

#### 3. `rombel_students` (Junction Table)
```sql
CREATE TABLE rombel_students (
    id INTEGER PRIMARY KEY,
    rombelId INTEGER REFERENCES rombel(id),
    studentId INTEGER REFERENCES students(id),
    isActive INTEGER DEFAULT 1,  -- 1 = aktif, 0 = tidak aktif
    leftAt TEXT,                 -- Tanggal keluar dari rombel
    createdAt TEXT
);
```

#### 4. `student_history` (Riwayat Status)
```sql
CREATE TABLE student_history (
    id INTEGER PRIMARY KEY,
    studentId INTEGER REFERENCES students(id),
    rombelId INTEGER REFERENCES rombel(id),
    statusType TEXT NOT NULL,     -- MUTASI | GRADUATE
    reason TEXT,                  -- Alasan (untuk MUTASI)
    completionDate TEXT NOT NULL,
    graduationYear TEXT,          -- Tahun kelulusan
    certificateNumber TEXT,       -- Nomor ijazah
    finalGrade TEXT,              -- Predikat
    scores TEXT,                  -- JSON nilai (opsional)
    createdAt TEXT
);
```

#### 5. `academic_year` (Tahun Ajaran)
```sql
CREATE TABLE academic_year (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,           -- Contoh: "2024/2025"
    startYear INTEGER,
    endYear INTEGER,
    startDate TEXT,
    endDate TEXT,
    isActive INTEGER DEFAULT 0
);
```

### Relasi Antar Tabel

```
students ──────┬───── rombel_students ───── rombel
               │              │
               │              │
               └───── student_history
                              │
                              └───── rombel
```

---

## API Endpoints

### Siswa

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/routes/api/studentDataSet` | Daftar semua siswa |
| GET | `/routes/api/students/active` | Siswa dengan status ACTIVE |
| GET | `/routes/api/students/graduated` | Siswa dengan status GRADUATE |
| GET | `/routes/api/students/dropout` | Siswa dengan status MUTASI |
| POST | `/routes/api/students/:id/status` | Ubah status siswa |
| GET | `/routes/api/graduates/stats` | Statistik alumni |

### Promosi (Kenaikan Kelas)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/routes/api/promotion/rombels` | Rombel yang bisa dipromosikan |
| GET | `/routes/api/promotion/students/:rombelId` | Siswa dalam rombel |
| GET | `/routes/api/promotion/targets/:classId` | Rombel tujuan |
| POST | `/routes/api/promotion/promote` | Eksekusi promosi |

### Tahun Ajaran

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/routes/api/academic-years` | Semua tahun ajaran |
| GET | `/routes/api/academic-years/lite` | Untuk dropdown |
| GET | `/routes/api/academic-years/active` | Tahun ajaran aktif |
| POST | `/routes/api/academic-years` | Tambah tahun ajaran |

---

## Alur Kerja Sistem

### Alur Kenaikan Kelas

```
┌─────────────────────────────────────────────────────────────┐
│                    TAB 1: PILIH ROMBEL                      │
│                                                             │
│   [Dropdown Rombel Asal]                                    │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ X-IPA-1  │ X-IPA-2 │ XI-IPS-1 │ ...                 │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   Menampilkan rombel yang BUKAN kelas akhir                 │
│   (XII dan IX tidak ditampilkan karena lulus, bukan naik)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  TAB 2: PROMOSI SISWA                       │
│                                                             │
│   Daftar Siswa:                                             │
│   ┌────┬──────────────┬──────────┬─────────────────────┐    │
│   │ ☑  │ Nama         │ NISN     │ Status              │    │
│   ├────┼──────────────┼──────────┼─────────────────────┤    │
│   │ ☑  │ Ahmad Fauzi  │ 12345... │ ACTIVE              │    │
│   │ ☐  │ Budi Santoso │ 67890... │ ACTIVE              │    │
│   └────┴──────────────┴──────────┴─────────────────────┘    │
│                                                             │
│   Rombel Tujuan: [Dropdown XI-IPA-1, XI-IPA-2, ...]         │
│                                                             │
│   [Promosikan Siswa Terpilih]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROSES DI BACKEND                        │
│                                                             │
│   1. Validasi siswa masih ACTIVE                            │
│   2. Mulai database transaction                             │
│   3. UPDATE rombel_students SET isActive=0 (rombel lama)    │
│   4. INSERT rombel_students (rombel baru, isActive=1)       │
│   5. Commit transaction                                     │
│   6. Return success response                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Alur Kelulusan

```
┌─────────────────────────────────────────────────────────────┐
│                    TAB 1: PILIH SISWA                       │
│                                                             │
│   Rombel Kelas Akhir: [XII-IPA-1 ▼]                         │
│   (Hanya menampilkan kelas XII atau IX)                     │
│                                                             │
│   ┌────┬──────────────┬──────────┬─────────────────────┐    │
│   │ ☑  │ Nama         │ NISN     │ Kelas               │    │
│   ├────┼──────────────┼──────────┼─────────────────────┤    │
│   │ ☑  │ Ahmad Fauzi  │ 12345... │ XII-IPA-1           │    │
│   │ ☑  │ Siti Aminah  │ 67890... │ XII-IPA-1           │    │
│   └────┴──────────────┴──────────┴─────────────────────┘    │
│                                                             │
│   Terpilih: 2 siswa                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   TAB 2: DATA KELULUSAN                     │
│                                                             │
│   Tahun Kelulusan:  [2024/2025 (Aktif) ▼]                   │
│   Tanggal Lulus:    [2025-06-15]                            │
│   Nomor Ijazah:     [DN-01 Ma 0123456] (opsional)           │
│   Predikat:         [Sangat Baik ▼] (opsional)              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Akan meluluskan 2 siswa dari XII-IPA-1              │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   [Konfirmasi Kelulusan]                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROSES DI BACKEND                        │
│                                                             │
│   Untuk setiap siswa (dalam transaction):                   │
│                                                             │
│   1. UPDATE students SET status='GRADUATE'                  │
│   2. UPDATE rombel_students SET isActive=0, leftAt=NOW()    │
│   3. INSERT student_history (                               │
│        statusType='GRADUATE',                               │
│        graduationYear, certificateNumber, finalGrade        │
│      )                                                      │
│   4. Commit transaction                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Catatan Teknis

### Debouncing pada Pencarian

Sistem menggunakan debounce untuk optimasi pencarian:

```typescript
let searchTimeout: ReturnType<typeof setTimeout>;
const DEBOUNCE_MS = 600;

function handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchQuery = value;
        fetchStudents(1);
    }, DEBOUNCE_MS);
}
```

### Reactive Statements (Svelte)

Menggunakan reactive statements untuk filter otomatis:

```typescript
// Filter data secara reaktif ketika searchQuery berubah
$: filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase());
});
```

### Error Handling Pattern

```typescript
try {
    // Operasi async
    const response = await API_FETCH(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    // Proses data...

} catch (error) {
    // Log error
    console.error('Error:', error);

    // Tampilkan pesan ke user
    alertModal = {
        show: true,
        type: 'error',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan'
    };
} finally {
    // Selalu jalankan (loading state, cleanup, dll)
    loading = false;
}
```

---

## Pengembangan Selanjutnya

Fitur yang dapat ditambahkan:
1. **Export Data**: Export alumni ke PDF/Excel
2. **Cetak Ijazah**: Template cetak ijazah
3. **Statistik Dashboard**: Grafik kelulusan per tahun
4. **Notifikasi**: Alert untuk siswa yang hampir lulus
5. **Backup History**: Arsip riwayat akademik lengkap

---

*Dokumentasi ini dibuat untuk SIAKAD Madrasah - Sistem Informasi Akademik*
*Terakhir diperbarui: Januari 2026*
