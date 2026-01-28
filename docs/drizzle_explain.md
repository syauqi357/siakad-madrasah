# Drizzle ORM - Schema & Migration Guide

Panduan lengkap untuk mengelola database schema menggunakan Drizzle ORM.

---

## 📚 Daftar Isi

1. [Perintah Utama](#-perintah-utama)
2. [Workflow Development vs Production](#-workflow-development-vs-production)
3. [Cara Kerja Migration](#-cara-kerja-migration)
4. [Contoh Penggunaan](#-contoh-penggunaan)
5. [Hal yang Perlu Diperhatikan](#️-hal-yang-perlu-diperhatikan)
6. [FAQ](#-faq)

---

## 🔧 Perintah Utama

### 1. `drizzle-kit push`

```bash
npx drizzle-kit push
```

| Aspek               | Keterangan                       |
| ------------------- | -------------------------------- |
| **Fungsi**          | Push schema langsung ke database |
| **Migration files** | ❌ Tidak dibuat                  |
| **Cocok untuk**     | Development / Prototyping        |
| **Kelebihan**       | Cepat dan simpel                 |
| **Kekurangan**      | Tidak ada history perubahan      |

---

### 2. `drizzle-kit generate`

```bash
npx drizzle-kit generate
```

| Aspek           | Keterangan                       |
| --------------- | -------------------------------- |
| **Fungsi**      | Generate file migration SQL      |
| **Output**      | File `.sql` di folder `drizzle/` |
| **Cocok untuk** | Production / Tim                 |

---

### 3. `drizzle-kit migrate`

```bash
npx drizzle-kit migrate
```

| Aspek             | Keterangan                                  |
| ----------------- | ------------------------------------------- |
| **Fungsi**        | Jalankan migration yang belum diaplikasikan |
| **Tracking**      | Dicatat di tabel `__drizzle_migrations`     |
| **Data existing** | ✅ Aman, tidak dihapus                      |

---

### 4. `drizzle-kit studio`

```bash
npx drizzle-kit studio
```

| Aspek        | Keterangan                         |
| ------------ | ---------------------------------- |
| **Fungsi**   | Buka Drizzle Studio GUI di browser |
| **Kegunaan** | Lihat data, edit manual, debug     |

---

## 🔄 Workflow Development vs Production

### Development (Cepat & Simpel)

```bash
# Edit schema file, lalu:
npx drizzle-kit push
```

- Langsung push perubahan ke database
- Tidak perlu manage migration files
- Cocok saat masih sering berubah-ubah schema

---

### Production (Aman & Terlacak)

```bash
# 1. Generate migration file
npx drizzle-kit generate

# 2. (Opsional) Review file SQL yang dihasilkan di folder drizzle/

# 3. Jalankan migration
npx drizzle-kit migrate
```

- Perubahan tercatat dalam file SQL
- Bisa di-version control (git)
- Bisa di-review sebelum dijalankan
- History perubahan terdokumentasi

---

## 🧠 Cara Kerja Migration

### Apakah Data Akan Hilang?

**TIDAK!** Migration bekerja secara **incremental**, bukan membuat ulang database.

### Proses Generate

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Schema Files   │ --> │    Drizzle      │ --> │  Migration SQL  │
│  (yang baru)    │     │    Compare      │     │  (perbedaan)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Current Database │
                    │ (yang existing)  │
                    └─────────────────┘
```

Drizzle akan **membandingkan** schema baru dengan kondisi database saat ini, lalu hanya generate SQL untuk **perbedaannya saja**.

---

## 📝 Contoh Penggunaan

### Menambah Kolom Baru

**Schema sebelum:**

```javascript
export const students = sqliteTable('students', {
	id: integer('id').primaryKey(),
	name: text('name')
});
```

**Schema sesudah:**

```javascript
export const students = sqliteTable('students', {
	id: integer('id').primaryKey(),
	name: text('name'),
	email: text('email'), // ← BARU
	phone: text('phone') // ← BARU
});
```

**Migration yang dihasilkan:**

```sql
ALTER TABLE students ADD COLUMN email TEXT;
ALTER TABLE students ADD COLUMN phone TEXT;
```

✅ Data existing **tetap aman** - hanya menambah kolom baru.

---

### Membuat Tabel Baru

**Tambah schema baru:**

```javascript
export const teachers = sqliteTable('teachers', {
	id: integer('id').primaryKey(),
	name: text('name'),
	subject: text('subject')
});
```

**Migration yang dihasilkan:**

```sql
CREATE TABLE teachers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  subject TEXT
);
```

✅ Tabel lain **tidak terpengaruh**.

---

## ⚠️ Hal yang Perlu Diperhatikan

### Operasi yang Bisa Menyebabkan Data Hilang

| Operasi            | Dampak                      | Solusi                      |
| ------------------ | --------------------------- | --------------------------- |
| **Rename kolom**   | Drizzle anggap DELETE + ADD | Edit manual file SQL        |
| **Hapus kolom**    | Data kolom hilang           | Backup dulu jika perlu      |
| **Ubah tipe data** | Bisa error/data corrupt     | Test di dev dulu            |
| **Hapus tabel**    | Semua data hilang           | Pastikan memang tidak perlu |

### Cara Edit Migration Manual

Jika migration yang di-generate tidak sesuai:

1. Jalankan `npx drizzle-kit generate`
2. Buka file SQL di folder `drizzle/`
3. Edit sesuai kebutuhan
4. Jalankan `npx drizzle-kit migrate`

**Contoh rename kolom (manual):**

```sql
-- Ganti ini:
-- ALTER TABLE students DROP COLUMN nama;
-- ALTER TABLE students ADD COLUMN name TEXT;

-- Dengan ini:
ALTER TABLE students RENAME COLUMN nama TO name;
```

---

## ❓ FAQ

### Q: Kapan pakai `push` vs `generate + migrate`?

| Situasi                           | Gunakan                |
| --------------------------------- | ---------------------- |
| Development lokal, sering berubah | `push`                 |
| Production server                 | `generate` + `migrate` |
| Kerja tim, perlu review           | `generate` + `migrate` |
| Demo/prototype cepat              | `push`                 |

---

### Q: Bagaimana Drizzle tahu migration mana yang sudah jalan?

Drizzle menyimpan record di tabel `__drizzle_migrations`:

```sql
SELECT * FROM __drizzle_migrations;
```

Output:

```
id | hash           | created_at
1  | abc123...      | 1706234567890
2  | def456...      | 1706234890123
```

---

### Q: Bisa rollback migration?

Drizzle **tidak** punya built-in rollback. Solusi:

1. Restore dari backup
2. Buat migration baru yang membalik perubahan
3. Gunakan version control (git) untuk track schema

---

### Q: File migration apa saja yang perlu di-commit ke git?

```
drizzle/
├── 0000_initial.sql        ✅ Commit
├── 0001_add_email.sql      ✅ Commit
├── meta/
│   ├── _journal.json       ✅ Commit
│   └── 0000_snapshot.json  ✅ Commit
```

Semua file di folder `drizzle/` perlu di-commit agar tim lain bisa menjalankan migration yang sama.

---

## 📋 Quick Reference

```bash
# Development - cepat & simpel
npx drizzle-kit push

# Production - aman & terlacak
npx drizzle-kit generate    # buat file migration
npx drizzle-kit migrate     # jalankan migration

# Tools tambahan
npx drizzle-kit studio      # buka GUI
npx drizzle-kit check       # cek schema valid
npx drizzle-kit drop        # hapus migration (hati-hati!)
```

---

## 🔗 Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit CLI Reference](https://orm.drizzle.team/kit-docs/overview)
- [SQLite dengan Drizzle](https://orm.drizzle.team/docs/get-started-sqlite)

---

_Dokumentasi ini dibuat untuk project SIAKAD Madrasah_
