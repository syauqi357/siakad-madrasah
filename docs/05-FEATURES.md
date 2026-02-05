# Features Documentation

## Student Lifecycle

```
ACTIVE → PROMOTED (next grade)
       → MUTASI (transferred out)
       → GRADUATED (completed)
       → DROPOUT (left school)
```

### Data Flow (Create Student)
1. Frontend collects nested data (student + address + parents)
2. Sends single POST request with full payload
3. Backend uses transaction for atomic insert
4. All related tables inserted or all rollback

---

## Rombel (Class Groups)

**What is Rombel?**
A specific class for a specific academic year.
- Example: "Kelas 1A - 2024/2025"

**Structure:**
```
Rombel
  ├── class_id (references classes)
  ├── academic_year_id (references academic_year)
  └── rombel_students (junction table)
        └── student assignments
```

**Student Filter:**
When adding students to rombel, system filters out already-assigned students using LEFT JOIN exclusion:
```sql
SELECT * FROM students
LEFT JOIN rombel_students ON ...
WHERE rombel_students.id IS NULL
```

---

## Scoring System

### Assessment Types
| Code | Name | Description |
|------|------|-------------|
| TUGAS | Tugas | Assignments |
| UH | Ulangan Harian | Daily tests |
| UTS | Ujian Tengah Semester | Midterm |
| UAS | Ujian Akhir Semester | Final exam |
| PRAKTIK | Praktik | Practical |
| PROYEK | Proyek | Projects |

### Score Entry Flow
1. Select rombel → Get students + subjects
2. Enter scores per assessment type
3. POST to `/score/scores` (upsert logic)
4. System creates or updates existing scores

### Excel Import
1. Download template (`GET /score/template/:rombelId`)
2. Fill scores in Excel
3. Upload (`POST /score/upload`)
4. System parses and bulk inserts

---

## Grade Promotion

**Flow:**
1. Select source rombel (current class)
2. Select target rombel (next grade)
3. Select students to promote
4. System updates `rombel_students` assignments

**Rules:**
- Student can only be in one active rombel per academic year
- Historical assignments preserved for records

---

## Graduation

**Flow:**
1. Select final-year rombel
2. Select students
3. Enter graduation data (date, certificate number)
4. System marks students as GRADUATED

**Bulk Graduation:**
`POST /graduates/bulk` with array of student IDs and common data.

---

## Excel Bulk Import (Students)

**Template Columns:**
- Student: fullName, nisn, nis, birthPlace, birthDate, gender, religion, etc.
- Address: province, city, district, village, street, postalCode
- Father: fatherName, fatherPhone, fatherJob, etc.
- Mother: motherName, motherPhone, motherJob, etc.

**Backend Processing:**
1. Parse Excel with ExcelJS
2. Validate each row
3. Use transaction for bulk insert
4. Return success/error count
