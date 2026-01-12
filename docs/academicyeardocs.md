## Drizzle Schema — `academic_year` (English, clean & future-proof)

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const academicYear = sqliteTable("academic_year", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull().unique(),

  startYear: integer("start_year"),
  endYear: integer("end_year"),

  startDate: text("start_date"),   // SQLite DATE = TEXT
  endDate: text("end_date"),

  isActive: integer("is_active").default(0), // BOOLEAN → INTEGER (0/1)
});
```

---

## Translation Reference (ID → EN)


| Indonesian Column  | English Column | Description |
|-------------------|---------------|-------------|
| id                | id            | Primary key |
| nama              | name          | Academic year name (unique) |
| tahun_mulai       | start_year    | Start year |
| tahun_selesai     | end_year      | End year |
| tanggal_mulai     | start_date    | Start date |
| tanggal_selesai   | end_date      | End date |
| is_active         | is_active     | Active academic year flag |

---

### 1️⃣ `is_active` = **CUMA SATU baris boleh 1**

Nanti **logic-level**, bukan DB-level:

```sql
UPDATE academic_year SET is_active = 0;
UPDATE academic_year SET is_active = 1 WHERE id = ?;
```

👉 **jangan pake multiple active year**

---

### 2️⃣ Nama `academic_year` ✔️

Lebih:

* internasional
* aman buat laporan
* aman buat skripsi
* nggak terikat bahasa lokal

---

### 3️⃣ Schema-only workflow (yang lu lakuin sekarang) = BENAR

```txt
design schema →
review logic →
baru migrate →
baru isi data
```
