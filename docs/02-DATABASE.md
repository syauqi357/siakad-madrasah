# Database Documentation

## Tech Stack
- **ORM**: Drizzle ORM
- **Database**: SQLite (better-sqlite3)
- **Schema Location**: `backend/src/db/schema/`

## Core Tables

| Table | Purpose |
|-------|---------|
| `users` | Admin/teacher accounts |
| `school_data` | School information |
| `teachers` | Teacher profiles |
| `classes` | Class levels (1-6) |
| `academic_year` | School years (only 1 active) |
| `rombel` | Class groups (class + year) |
| `rombel_students` | Student-rombel assignments |
| `student` | Student master data |
| `student_address` | Student addresses |
| `student_father` | Father information |
| `student_mother` | Mother information |
| `subjects` | Subject list |
| `class_subjects` | Subject-class-teacher mapping |
| `assessment_type` | Score categories (UH, UTS, UAS) |
| `student_scores` | Student grades |
| `audit_log` | Activity logging |

## Column Naming Convention

Indonesian → English mapping:

| Indonesian | English |
|------------|---------|
| `nama_lengkap` | `fullName` |
| `tempat_lahir` | `birthPlace` |
| `tanggal_lahir` | `birthDate` |
| `jenis_kelamin` | `gender` |
| `alamat` | `address` |
| `nomor_telepon` | `phoneNumber` |
| `tahun_ajaran` | `academicYear` |
| `kelas` | `class` |

## Drizzle ORM Commands

| Command | When to Use |
|---------|-------------|
| `npx drizzle-kit push` | Development - quick sync |
| `npx drizzle-kit generate` | Create migration file |
| `npx drizzle-kit migrate` | Production - run migrations |
| `npx drizzle-kit studio` | Visual DB browser |

### Development Workflow
```bash
# Edit schema → Push directly
npx drizzle-kit push
```

### Production Workflow
```bash
# Edit schema → Generate → Commit → Deploy → Migrate
npx drizzle-kit generate
git add . && git commit -m "migration: add column"
npx drizzle-kit migrate
```

### Safe Operations
- Adding columns (nullable or with default)
- Creating new tables
- Adding indexes

### Risky Operations (backup first!)
- Dropping columns/tables
- Renaming columns
- Changing column types

## Transaction Pattern

For multi-table inserts (e.g., student + address + parents):

```javascript
await db.transaction(async (tx) => {
  const [student] = await tx.insert(studentTable).values(studentData).returning();
  await tx.insert(addressTable).values({ ...addressData, studentId: student.id });
  await tx.insert(fatherTable).values({ ...fatherData, studentId: student.id });
  // If any fails, all rollback
});
```
