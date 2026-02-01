# Student Status Management Feature

## Overview

Implement a student status management system where students can transition from ACTIVE to either MUTASI (dropout) or GRADUATE status. When status changes, students are removed from active ROMBEL and moved to respective filtered views.

## Database Schema Changes

### 1. Update `students` table

Add status field if not exists:

```sql
ALTER TABLE students
ADD COLUMN status ENUM('ACTIVE', 'MUTASI', 'GRADUATE') DEFAULT 'ACTIVE';
```

### 2. Update `rombel_students` table

Add tracking fields:

```sql
ALTER TABLE rombel_students
ADD COLUMN is_active BOOLEAN DEFAULT 1,
ADD COLUMN left_at TIMESTAMP NULL;
```

### 3. Create `student_history` table

Store historical data when students leave ROMBEL:

```sql
CREATE TABLE student_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  rombel_id INT NOT NULL,
  scores JSON,
  status_type ENUM('MUTASI', 'GRADUATE') NOT NULL,
  reason VARCHAR(500) NULL, -- Only for MUTASI
  completion_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (rombel_id) REFERENCES rombel(id)
);
```

## Service Layer Implementation

### File: `services/studentService.js`

Create the following methods:

#### 1. Get Active Students

```javascript
async getActiveStudents(filters = {}) {
  // Query students with status = 'ACTIVE'
  // Include JOIN with rombel_students where is_active = 1
  // Return student list with current ROMBEL info
}
```

#### 2. Get Dropout Students (Mutasi)

```javascript
async getDropoutStudents(filters = {}) {
  // Query students with status = 'MUTASI'
  // Include student_history data
  // Return list with reason and last ROMBEL info
}
```

#### 3. Get Graduated Students

```javascript
async getGraduatedStudents(filters = {}) {
  // Query students with status = 'GRADUATE'
  // Include student_history data
  // Return list with final scores and last ROMBEL info
}
```

#### 4. Change Student Status (TRANSACTIONAL)

```javascript
async changeStudentStatus(studentId, newStatus, data) {
  // newStatus: 'MUTASI' or 'GRADUATE'
  // data: { scores: {...}, reason: 'optional for MUTASI' }

  // Use database transaction:
  // 1. Get current ROMBEL from rombel_students where is_active = 1
  // 2. UPDATE students SET status = newStatus WHERE id = studentId
  // 3. UPDATE rombel_students SET is_active = 0, left_at = NOW() WHERE student_id = studentId
  // 4. INSERT INTO student_history (student_id, rombel_id, scores, status_type, reason, completion_date)

  // If any step fails, rollback entire transaction
  // Return success/error response
}
```

## Controller Layer

### File: `controllers/studentController.js`

Create endpoints:

1. `GET /students/active` - calls `getActiveStudents()`
2. `GET /students/dropout` - calls `getDropoutStudents()`
3. `GET /students/graduated` - calls `getGraduatedStudents()`
4. `POST /students/:id/status` - calls `changeStudentStatus()`
   - Body: `{ status: 'MUTASI' | 'GRADUATE', scores: {...}, reason?: '...' }`
   - Validate that status is either MUTASI or GRADUATE
   - Validate student is currently ACTIVE before allowing change

## Routes

### File: `routes/studentRoutes.js`

```javascript
router.get('/students/active', studentController.getActiveStudents);
router.get('/students/dropout', studentController.getDropoutStudents);
router.get('/students/graduated', studentController.getGraduatedStudents);
router.post('/students/:id/status', studentController.changeStudentStatus);
```

## Business Rules

1. Only ACTIVE students can transition to MUTASI or GRADUATE
2. MUTASI and GRADUATE are final statuses (no going back to ACTIVE)
3. When status changes:
   - Student must be removed from active ROMBEL (is_active = 0)
   - History record must be created
   - Both operations must succeed atomically (use transaction)
4. MUTASI requires a reason field
5. GRADUATE requires final scores
6. Both statuses store last ROMBEL and scores in student_history

## Error Handling

- Validate student exists and is ACTIVE before status change
- Validate student is actually in a ROMBEL before transition
- Handle transaction failures with rollback
- Return appropriate error messages for validation failures

## Notes

- Use your existing Express layered architecture (route → controller → service → repository)
- Database transactions are CRITICAL for changeStudentStatus to maintain data consistency
- The student record stays in the same `students` table, just filtered by status field
- No need for separate graduate/mutasi tables - use status field + student_history for tracking

---

# GRADUATE / Alumni Feature Plan

## Overview

Implement graduation workflow where ACTIVE students can be graduated with their final scores recorded. Alumni data should display graduation year, final scores, and last class info.

## What's Already Done (from MUTASI implementation)

- ✅ `student_history` table exists with: `scores`, `statusType`, `completionDate`
- ✅ `changeStudentStatus()` service supports GRADUATE status
- ✅ `getGraduatedStudents()` service exists
- ✅ API endpoint `POST /students/:id/status` works for GRADUATE
- ✅ API endpoint `GET /students/graduated` returns alumni list

## What Needs to Be Added

### 1. Database Schema (Optional Enhancement)

Consider adding to `student_history` for GRADUATE-specific data:

```sql
ALTER TABLE student_history ADD COLUMN graduation_year TEXT;
ALTER TABLE student_history ADD COLUMN certificate_number TEXT;  -- Nomor Ijazah
ALTER TABLE student_history ADD COLUMN final_grade TEXT;  -- Nilai Akhir / Predikat
```

### 2. Backend Updates

#### File: `src/db/schema/studentHistory.js`

Add optional fields:

```javascript
graduationYear: text('graduation_year'),
certificateNumber: text('certificate_number'),
finalGrade: text('final_grade')  // A/B/C or Sangat Baik/Baik/Cukup
```

#### File: `services/student.service.js`

Update `changeStudentStatus()` to accept GRADUATE-specific data:

```javascript
// data for GRADUATE:
{
  scores: JSON string of final scores,
  completionDate: graduation date,
  graduationYear: '2025/2026',
  certificateNumber: 'DN-01 Ma 0123456',
  finalGrade: 'Sangat Baik'
}
```

Update `getGraduatedStudents()` to return all alumni fields.

### 3. Frontend Components

#### A. Graduate Modal (`lib/components/modal/GraduateModal.svelte`)

Form fields:

- Tahun Kelulusan (dropdown: 2024/2025, 2025/2026, etc.)
- Tanggal Kelulusan (date picker)
- Nomor Ijazah (text input, optional)
- Predikat/Nilai Akhir (dropdown: Sangat Baik, Baik, Cukup, Kurang)
- Nilai Akhir (JSON input or auto-fetch from scores table)

#### B. Alumni Page (`routes/(app)/siswa/alumni/+page.svelte`)

Layout sections:

1. **Header**: Title, search, filter by year
2. **Stats Cards**: Total alumni, per-year count
3. **Alumni Table**:
   - No
   - Nama Siswa
   - NISN
   - Kelas Terakhir
   - Tahun Lulus
   - Nomor Ijazah
   - Predikat
   - Aksi (View Detail)

#### C. Alumni Detail Page (optional)

- Student info
- Final scores breakdown by subject
- Certificate info
- Print/export capability

### 4. UI Flow

```
Student Detail Page (/siswa/[id])
    │
    ├── [If ACTIVE] Show "Luluskan Siswa" button
    │       │
    │       └── Click → Open GraduateModal
    │               │
    │               ├── Fill graduation info
    │               ├── Submit → POST /students/:id/status
    │               └── Success → Update UI, show success message
    │
    └── [If GRADUATE] Show "Alumni" badge, hide graduation button
```

### 5. Layout Structure for Alumni Page

```
┌─────────────────────────────────────────────────────────┐
│  Alumni / Lulusan                           [Search]    │
│  Daftar siswa yang telah lulus              [Filter ▼]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │
│  │ Total   │  │ 2025    │  │ 2024    │   (Year cards)   │
│  │   150   │  │   45    │  │   52    │                  │
│  └─────────┘  └─────────┘  └─────────┘                  │
├─────────────────────────────────────────────────────────┤
│  No │ Nama      │ NISN  │ Kelas │ Tahun │ Ijazah │ Aksi │
│  ───┼───────────┼───────┼───────┼───────┼────────┼───── │
│  1  │ Ahmad...  │ 123.. │ XII-A │ 2025  │ DN-01..│ [>]  │
│  2  │ Budi...   │ 456.. │ XII-B │ 2025  │ DN-01..│ [>]  │
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│  [Prev]  1  2  3  ...  10  [Next]          Showing 10   │
└─────────────────────────────────────────────────────────┘
```

### 6. Implementation Checklist

#### Backend:

- [ ] Add graduation fields to studentHistory schema
- [ ] Run migration to add new columns
- [ ] Update changeStudentStatus to save graduation data
- [ ] Update getGraduatedStudents to return all fields
- [ ] Add countGraduatesByYear() for stats

#### Frontend:

- [ ] Create GraduateModal.svelte component
- [ ] Add "Luluskan Siswa" button to siswa/[id] page
- [ ] Build siswa/alumni/+page.svelte layout
- [ ] Add year filter functionality
- [ ] (Optional) Alumni detail page
- [ ] (Optional) Export/print alumni list

### 7. API Endpoints Summary

| Method | Endpoint                        | Purpose                     |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/students/graduated`           | List all alumni (paginated) |
| GET    | `/students/graduated?year=2025` | Filter by graduation year   |
| POST   | `/students/:id/status`          | Graduate a student          |

### 8. Sample Request Body for Graduation

```json
POST /routes/api/students/123/status
{
  "status": "GRADUATE",
  "completionDate": "2025-06-15",
  "graduationYear": "2024/2025",
  "certificateNumber": "DN-01 Ma 0123456",
  "finalGrade": "Sangat Baik",
  "scores": "{\"matematika\": 85, \"bahasa_indonesia\": 90, \"ipa\": 88}"
}
```

### 9. Notes

- Graduation should only be possible for final year students (optional validation)
- Consider bulk graduation feature for end of school year
- Certificate number can be generated or manually input
- Scores can be auto-fetched from existing score records or manually input

---

# Class, Subject & Scoring System Architecture

## Overview - Understanding the Hierarchy

This document explains the relationship between classes, rombels, subjects, and how scores are stored.

## Entity Relationship Diagram (ASCII)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  academic_year  │     │     classes     │     │    subjects     │
│─────────────────│     │─────────────────│     │─────────────────│
│ id              │     │ id              │     │ id              │
│ name (2024/2025)│     │ className (X,   │     │ name (Matematika│
│ startYear       │     │   XI, XII)      │     │   B.Indonesia)  │
│ endYear         │     │                 │     │ subjectCode     │
│ isActive        │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │              ┌────────┴────────┐              │
         │              │                 │              │
         ▼              ▼                 ▼              ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│        rombel           │     │         class_subject           │
│─────────────────────────│     │─────────────────────────────────│
│ id                      │     │ id                              │
│ code (X-IPA-1)          │     │ classId → classes.id            │
│ name (Kelas X IPA 1)    │     │ subjectId → subjects.id         │
│ classId → classes.id    │◄────│ teacherId → teachers.id         │
│ academicYearId          │     │                                 │
│ classAdvisorId          │     │ (Defines: "Kelas X teaches      │
│ studentCapacity         │     │  Matematika by Pak Budi")       │
└───────────┬─────────────┘     └────────────────┬────────────────┘
            │                                    │
            ▼                                    │
┌─────────────────────────┐                      │
│    rombel_students      │                      │
│─────────────────────────│                      │
│ rombelId → rombel.id    │                      │
│ studentId → students.id │                      │
│ isActive                │                      │
│ leftAt                  │                      │
└───────────┬─────────────┘                      │
            │                                    │
            ▼                                    ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│       students          │     │        student_scores           │
│─────────────────────────│     │─────────────────────────────────│
│ id                      │────►│ studentId → students.id         │
│ studentName             │     │ classSubjectId → class_subject  │
│ nisn                    │     │ assessmentTypeId → assessment   │
│ status (ACTIVE/MUTASI/  │     │ score (0-100)                   │
│         GRADUATE)       │     │ assessmentDate                  │
└─────────────────────────┘     │ note                            │
                                └─────────────────────────────────┘
```

## Key Concepts Explained

### 1. `classes` - Grade Level (Tingkat Kelas)

**Purpose**: Defines the academic grade level.
**Examples**: `X`, `XI`, `XII` (or `7`, `8`, `9` for SMP)

```
┌────┬───────────┐
│ id │ className │
├────┼───────────┤
│  1 │ X         │  ← Kelas 10
│  2 │ XI        │  ← Kelas 11
│  3 │ XII       │  ← Kelas 12
└────┴───────────┘
```

### 2. `rombel` - Class Group (Rombongan Belajar)

**Purpose**: The actual class instance where students are grouped.
**Examples**: `X-IPA-1`, `X-IPA-2`, `XI-IPS-1`

```
┌────┬──────────┬────────────────┬─────────┬────────────────┐
│ id │ code     │ name           │ classId │ academicYearId │
├────┼──────────┼────────────────┼─────────┼────────────────┤
│  1 │ X-IPA-1  │ Kelas X IPA 1  │ 1       │ 1 (2024/2025)  │
│  2 │ X-IPA-2  │ Kelas X IPA 2  │ 1       │ 1              │
│  3 │ XI-IPS-1 │ Kelas XI IPS 1 │ 2       │ 1              │
└────┴──────────┴────────────────┴─────────┴────────────────┘
```

**Key Point**: Multiple rombels can belong to the same `class` (grade level).

### 3. `class_subject` - Subject Assignment per Grade

**Purpose**: Defines which subjects are taught at which grade level, and by which teacher.

```
┌────┬─────────┬───────────┬───────────┐
│ id │ classId │ subjectId │ teacherId │
├────┼─────────┼───────────┼───────────┤
│  1 │ 1 (X)   │ 1 (MTK)   │ 5 (Budi)  │  ← "Matematika Kelas X oleh Pak Budi"
│  2 │ 1 (X)   │ 2 (BIndo) │ 3 (Ani)   │  ← "B. Indonesia Kelas X oleh Bu Ani"
│  3 │ 2 (XI)  │ 1 (MTK)   │ 5 (Budi)  │  ← "Matematika Kelas XI oleh Pak Budi"
└────┴─────────┴───────────┴───────────┘
```

**Key Point**: Subjects are assigned to GRADE LEVEL (`classId`), NOT to specific rombels.

### 4. `student_scores` - Score Records

**Purpose**: Stores individual student scores.

```
┌────┬───────────┬────────────────┬──────────────────┬───────┐
│ id │ studentId │ classSubjectId │ assessmentTypeId │ score │
├────┼───────────┼────────────────┼──────────────────┼───────┤
│  1 │ 101       │ 1 (X-MTK)      │ 1 (UH)           │ 85    │
│  2 │ 101       │ 1 (X-MTK)      │ 2 (UTS)          │ 78    │
│  3 │ 102       │ 1 (X-MTK)      │ 1 (UH)           │ 90    │
└────┴───────────┴────────────────┴──────────────────┴───────┘
```

## The Confusion: Why `classSubjectId` and NOT `rombelId`?

### Current Design

Scores are linked to `class_subject`, which means:

- Student A in **X-IPA-1** and Student B in **X-IPA-2** both have scores linked to "Matematika Kelas X" (`classSubjectId = 1`)
- The score doesn't track WHICH specific rombel the student was in

### This Works Because:

1. All rombels in the same grade (e.g., all Kelas X) study the SAME subjects
2. The teacher might teach multiple rombels in the same grade
3. When generating reports, we can JOIN through: `student → rombel_students → rombel → class → class_subject`

### Potential Issue:

If you need to track "Student A's Matematika score specifically in X-IPA-1", the current design doesn't support this directly.

## Data Flow for Score Input

### Workflow 1: Input Scores by Rombel (Recommended)

```
Teacher selects:
  1. Rombel: "X-IPA-1" (rombelId = 1)
  2. Subject: "Matematika" (auto-filtered based on rombel's classId)
  3. Assessment Type: "UH" (assessmentTypeId = 1)

System:
  1. Get classId from rombel (classId = 1 for "X")
  2. Find class_subject where classId=1 AND subjectId=Matematika → classSubjectId
  3. Get all students from rombel_students WHERE rombelId = 1
  4. For each student, INSERT into student_scores:
     - studentId
     - classSubjectId (derived from class + subject)
     - assessmentTypeId
     - score
```

### Workflow 2: Bulk Upload via Excel Template

```
1. Generate template for specific rombel:
   - Fetch students from rombel_students
   - Fetch assessment types for columns

2. Teacher fills scores in Excel

3. Upload & parse:
   - Validate student IDs
   - Derive classSubjectId from rombel's classId + selected subject
   - Bulk insert scores
```

## Score Service Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        SCORE INPUT FLOW                              │
└──────────────────────────────────────────────────────────────────────┘

User Interface (Frontend)
         │
         ▼
┌─────────────────────────────────────┐
│  1. Select Rombel                   │  → GET /api/rombel (list rombels)
│     [Dropdown: X-IPA-1, X-IPA-2...] │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  2. Select Subject                  │  → GET /api/score/subjects/:rombelId
│     [Dropdown: Matematika, B.Indo]  │     (returns subjects for that grade)
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  3. Select Assessment Type          │  → GET /api/assessment-types/lite
│     [Dropdown: UH, UTS, UAS]        │     (returns active assessment types)
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  4. Load Students + Input Scores    │  → GET /api/score/template/:rombelId
│     ┌────────┬──────┬────┬────┐     │     (returns student list with
│     │ NISN   │ Nama │ UH │UTS │     │      empty score columns)
│     ├────────┼──────┼────┼────┤     │
│     │ 123... │ Budi │ 85 │    │     │
│     │ 456... │ Ani  │ 90 │    │     │
│     └────────┴──────┴────┴────┘     │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  5. Submit Scores                   │  → POST /api/score/bulk
│                                     │     Body: {
└─────────────────────────────────────┘       rombelId: 1,
                                              subjectId: 1,
                                              assessmentTypeId: 1,
                                              scores: [
                                                {studentId: 101, score: 85},
                                                {studentId: 102, score: 90}
                                              ]
                                            }
```

## Recommended Service Functions for Score Management

### `score.services.js` - Functions Needed

```javascript
// 1. Get subjects available for a rombel (based on its grade/class)
getSubjectsForRombel(rombelId)
  → Returns: [{id, name, code}]
  → Logic: rombel → classId → class_subject → subjects

// 2. Get students in a rombel for score input
getStudentsForScoreInput(rombelId)
  → Returns: [{id, nisn, name}]
  → Logic: rombel_students WHERE rombelId AND isActive = true

// 3. Get existing scores for a rombel + subject + assessment
getExistingScores(rombelId, subjectId, assessmentTypeId)
  → Returns: [{studentId, studentName, score}]
  → Logic: Complex JOIN

// 4. Save/Update bulk scores (TRANSACTIONAL)
saveBulkScores(rombelId, subjectId, assessmentTypeId, scoresArray)
  → Logic:
     a. Derive classSubjectId from rombelId → classId + subjectId
     b. Validate all studentIds belong to the rombel
     c. UPSERT scores (insert or update if exists)
  → Returns: {successCount, errors}

// 5. Get score summary for a student
getStudentScoreSummary(studentId, academicYearId?)
  → Returns: [{subject, scores: {UH: 85, UTS: 78, UAS: 80}, average}]

// 6. Get score report for a rombel (for rapor/report card)
getRombelScoreReport(rombelId)
  → Returns: Full matrix of students × subjects × assessments
```

## Why This Architecture?

### Pros:

1. **Flexibility**: Same subject definition across multiple rombels in same grade
2. **Teacher Assignment**: One teacher can teach same subject to all rombels in a grade
3. **Simpler Reporting**: Aggregate by grade level easily
4. **Less Redundancy**: Don't need to duplicate subject assignments per rombel

### Cons:

1. **No Rombel-Specific Tracking**: Can't differentiate "X-IPA-1 Matematika" from "X-IPA-2 Matematika" at score level
2. **Confusing JOINs**: Need multiple joins to connect student → score → subject → rombel

## Alternative Architecture (If Needed)

If you need rombel-specific subject assignments (e.g., different teachers per rombel for same subject):

```sql
-- Option A: Add rombelId to class_subject
ALTER TABLE class_subject ADD COLUMN rombel_id INTEGER REFERENCES rombel(id);

-- Option B: Create rombel_subject junction table
CREATE TABLE rombel_subject (
  id INTEGER PRIMARY KEY,
  rombel_id INTEGER REFERENCES rombel(id),
  subject_id INTEGER REFERENCES subjects(id),
  teacher_id INTEGER REFERENCES teachers(id),
  UNIQUE(rombel_id, subject_id)
);

-- Then student_scores would reference rombel_subject instead of class_subject
```

**Recommendation**: Keep current design unless you have specific requirements for rombel-level subject differentiation.

## Quick Reference: Common Queries

### Get all subjects for a rombel

```javascript
// 1. Get classId from rombel
const rombelData = await db
	.select({ classId: rombel.classId })
	.from(rombel)
	.where(eq(rombel.id, rombelId));

// 2. Get subjects for that class
const subjects = await db
	.select({ id: Subjects.id, name: Subjects.name })
	.from(classSubject)
	.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
	.where(eq(classSubject.classId, rombelData[0].classId));
```

### Get classSubjectId from rombelId + subjectId

```javascript
// 1. Get classId from rombel
const rombelData = await db
	.select({ classId: rombel.classId })
	.from(rombel)
	.where(eq(rombel.id, rombelId));

// 2. Find class_subject
const cs = await db
	.select({ id: classSubject.id })
	.from(classSubject)
	.where(
		and(eq(classSubject.classId, rombelData[0].classId), eq(classSubject.subjectId, subjectId))
	);

const classSubjectId = cs[0]?.id;
```

### Insert score with proper foreign keys

```javascript
await db.insert(studentScores).values({
	studentId: studentId,
	classSubjectId: classSubjectId, // Derived from rombel's class + subject
	assessmentTypeId: assessmentTypeId,
	score: 85,
	assessmentDate: new Date().toISOString().split('T')[0]
});
```

---

# Assessment Type System

## Overview

Assessment types define the categories of evaluations used to grade students (e.g., daily tasks, midterm exams, final exams). They are **GLOBAL** - meaning the same assessment types apply across all subjects and classes.

## Entity Relationship

```
┌─────────────────────────┐
│     assessment_type     │
│─────────────────────────│
│ id                      │
│ code (UH, UTS, UAS)     │
│ name (Ulangan Harian)   │
│ defaultWeight (optional)│
│ isActive                │
└───────────┬─────────────┘
            │
            │ (1 : Many)
            │
            ▼
┌─────────────────────────────────┐
│        student_scores           │
│─────────────────────────────────│
│ id                              │
│ studentId → students.id         │
│ classSubjectId → class_subject  │◄─── Links to Subject + Class
│ assessmentTypeId → assessment   │◄─── Links to Assessment Type
│ score (0-100)                   │
│ assessmentDate                  │
│ note                            │
└─────────────────────────────────┘
```

## Database Schema

### `assessment_type` Table

```sql
┌────┬───────┬─────────────────────────┬───────────────┬──────────┐
│ id │ code  │ name                    │ defaultWeight │ isActive │
├────┼───────┼─────────────────────────┼───────────────┼──────────┤
│  1 │ TUGAS │ Tugas Harian            │ 20            │ 1        │
│  2 │ UH    │ Ulangan Harian          │ 20            │ 1        │
│  3 │ UTS   │ Ujian Tengah Semester   │ 30            │ 1        │
│  4 │ UAS   │ Ujian Akhir Semester    │ 30            │ 1        │
└────┴───────┴─────────────────────────┴───────────────┴──────────┘
```

### Key Fields:

- **code**: Short identifier (TUGAS, UH, UTS, UAS)
- **name**: Human-readable name
- **defaultWeight**: Optional percentage weight for final grade calculation
- **isActive**: Enable/disable assessment type

## Relationship Explanation

### Assessment Types are GLOBAL

Unlike subjects which are assigned per class (`class_subject`), assessment types are **universal**:

- UH (Ulangan Harian) applies to ALL subjects in ALL classes
- UTS applies to Math Class X, Science Class XI, etc. - same assessment type

### The Score Triangle

A student score is identified by THREE foreign keys:

```
student_scores
├── studentId        → WHO is being graded
├── classSubjectId   → WHAT subject (in which class)
└── assessmentTypeId → WHEN/TYPE of assessment
```

**Example**: "Ahmad's UTS score for Math in Class X"

```
studentId: 101 (Ahmad)
classSubjectId: 5 (Math-Class X)
assessmentTypeId: 3 (UTS)
score: 85
```

### Unique Constraint

A student can only have ONE score per subject per assessment type:

```sql
UNIQUE(studentId, classSubjectId, assessmentTypeId)
```

This prevents duplicate entries like "two UTS scores for Math".

## Weight Calculation (Grade Formula)

### Option 1: Global Weights (Current Design)

All subjects use the same weight distribution:

```
Final Grade = (TUGAS × 20%) + (UH × 20%) + (UTS × 30%) + (UAS × 30%)
```

### Option 2: Per-Subject Weights (Future Enhancement)

If different subjects need different weights, create a junction table:

```sql
CREATE TABLE subject_assessment_weight (
  id INTEGER PRIMARY KEY,
  classSubjectId INTEGER REFERENCES class_subject(id),
  assessmentTypeId INTEGER REFERENCES assessment_type(id),
  weight INTEGER NOT NULL,  -- Percentage (0-100)
  UNIQUE(classSubjectId, assessmentTypeId)
);
```

**Example**: Math might weight exams higher, Art might weight tasks higher:

```
┌────┬────────────────┬──────────────────┬────────┐
│ id │ classSubjectId │ assessmentTypeId │ weight │
├────┼────────────────┼──────────────────┼────────┤
│  1 │ 1 (Math-X)     │ 1 (TUGAS)        │ 10     │
│  2 │ 1 (Math-X)     │ 4 (UAS)          │ 40     │
│  3 │ 5 (Art-X)      │ 1 (TUGAS)        │ 50     │
│  4 │ 5 (Art-X)      │ 4 (UAS)          │ 10     │
└────┴────────────────┴──────────────────┴────────┘
```

## API Endpoints

| Method | Endpoint                 | Purpose                                     |
| ------ | ------------------------ | ------------------------------------------- |
| GET    | `/assessment-types`      | List all assessment types (with pagination) |
| GET    | `/assessment-types/lite` | List active types only (for dropdowns)      |
| GET    | `/assessment-types/:id`  | Get single assessment type                  |
| POST   | `/assessment-types`      | Create new assessment type                  |
| PUT    | `/assessment-types/:id`  | Update assessment type                      |
| DELETE | `/assessment-types/:id`  | Delete assessment type                      |

## Score Input Workflow with Assessment Types

```
1. Teacher selects:
   - Rombel: "X-IPA-1"
   - Subject: "Matematika"
   - Assessment Type: "UTS"  ◄── From dropdown (GET /assessment-types/lite)

2. System loads:
   - Students in that rombel
   - Existing scores for that assessment (if any)

3. Teacher inputs scores:
   ┌────────┬──────────┬───────┐
   │ NISN   │ Nama     │ Score │
   ├────────┼──────────┼───────┤
   │ 123... │ Ahmad    │ 85    │
   │ 456... │ Budi     │ 78    │
   └────────┴──────────┴───────┘

4. System saves:
   - Derives classSubjectId from rombel + subject
   - Uses selected assessmentTypeId
   - UPSERT scores (insert or update existing)
```

## Common Queries

### Get all assessment types (active only)

```javascript
const types = await db.select().from(assessmentType).where(eq(assessmentType.isActive, true));
```

### Get scores grouped by assessment type for a student

```javascript
const scores = await db
	.select({
		assessmentCode: assessmentType.code,
		assessmentName: assessmentType.name,
		subjectName: Subjects.name,
		score: studentScores.score
	})
	.from(studentScores)
	.innerJoin(assessmentType, eq(studentScores.assessmentTypeId, assessmentType.id))
	.innerJoin(classSubject, eq(studentScores.classSubjectId, classSubject.id))
	.innerJoin(Subjects, eq(classSubject.subjectId, Subjects.id))
	.where(eq(studentScores.studentId, studentId));
```

### Calculate weighted average for a student in a subject

```javascript
// Assuming defaultWeight exists on assessment_type
const weightedScores = await db
	.select({
		score: studentScores.score,
		weight: assessmentType.defaultWeight
	})
	.from(studentScores)
	.innerJoin(assessmentType, eq(studentScores.assessmentTypeId, assessmentType.id))
	.where(
		and(eq(studentScores.studentId, studentId), eq(studentScores.classSubjectId, classSubjectId))
	);

// Calculate: Σ(score × weight) / Σ(weight)
const totalWeight = weightedScores.reduce((sum, s) => sum + (s.weight || 0), 0);
const weightedSum = weightedScores.reduce((sum, s) => sum + s.score * (s.weight || 0), 0);
const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;
```

## Summary

| Aspect                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| **Scope**               | GLOBAL - same types for all subjects/classes |
| **Examples**            | TUGAS, UH, UTS, UAS, Praktikum, Proyek       |
| **Weights**             | Optional, stored in `defaultWeight` field    |
| **Per-Subject Weights** | Not supported (requires junction table)      |
| **Unique Score**        | One score per student+subject+assessmentType |

---

# Student Lifecycle Management (IMPLEMENTED)

## Why Not Just DELETE?

Simple SIAKAD systems delete students when they leave. Our system keeps them because:

1. **Alumni Records** - Schools need graduation data for years (transcripts, verification)
2. **Score History** - Preserved for reporting and archives
3. **Audit Trail** - Know who was in which class, when they left, why

If you don't need this, you CAN just delete. But most real schools need history.

---

## The Simple Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT LIFECYCLE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐      ┌──────────┐      ┌──────────┐              │
│   │  ENROLL  │ ───► │  ACTIVE  │ ───► │   END    │              │
│   └──────────┘      └──────────┘      └──────────┘              │
│                          │                  │                   │
│                          │            ┌─────┴─────┐             │
│                          │            │           │             │
│                     Each Year:    GRADUATE    MUTASI            │
│                     PROMOTE       (lulus)    (keluar)           │
│                     to next                                     │
│                     class                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Three Operations Only

### 1. PROMOTE (Kenaikan Kelas)

**When:** End of school year, student moves to next grade
**What Happens:**

```
students table      → status stays 'ACTIVE' (no change)
rombel_students     → old record: isActive=false, leftAt=now
                    → new record: isActive=true (new rombel)
```

**API:** `POST /routes/api/promotion/promote`
**Page:** `/score/upgrade`

### 2. GRADUATE (Kelulusan)

**When:** Final year student completes school
**What Happens:**

```
students table      → status changes to 'GRADUATE'
rombel_students     → isActive=false, leftAt=now
student_history     → new record with graduation data
```

**API:** `POST /routes/api/graduates/:id`
**Page:** Click "Luluskan Siswa" button on `/siswa/[id]`

### 3. MUTASI (Keluar/Pindah)

**When:** Student leaves school (transfer, dropout, etc.)
**What Happens:**

```
students table      → status changes to 'MUTASI'
rombel_students     → isActive=false, leftAt=now
student_history     → new record with reason
```

**API:** `POST /routes/api/students/:id/status`
**Page:** Click "Mutasi Siswa" button on `/siswa/[id]`

---

## Database Tables Involved

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    students     │     │ rombel_students │     │ student_history │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ rombelId        │     │ studentId       │
│ studentName     │     │ studentId       │     │ rombelId        │
│ nisn            │     │ isActive ◄──────┼─────│ statusType      │
│ status ◄────────┼─────│ leftAt          │     │ scores (JSON)   │
│   ACTIVE        │     └─────────────────┘     │ reason          │
│   MUTASI        │                             │ graduationYear  │
│   GRADUATE      │                             │ certificateNum  │
└─────────────────┘                             │ completionDate  │
                                                └─────────────────┘
```

**Key Points:**

- `students.status` = Current state of student
- `rombel_students.isActive` = Is student currently in THIS rombel?
- `student_history` = Archive when student leaves (MUTASI or GRADUATE)

---

## Where Students Appear

| Status   | `/siswa`    | `/siswa/alumni` | `/siswa/mutasi` | Rombel Detail         |
| -------- | ----------- | --------------- | --------------- | --------------------- |
| ACTIVE   | ✅          | ❌              | ❌              | ✅ (if isActive=true) |
| GRADUATE | ❌ (hidden) | ✅              | ❌              | ❌                    |
| MUTASI   | ❌ (hidden) | ❌              | ✅              | ❌                    |

---

## End-of-Year Workflow

```
Step 1: GRADUATE final year students (Kelas XII)
        └── Use bulk graduate or individual graduation
        └── They move to Alumni page

Step 2: PROMOTE other students (Kelas X, XI)
        └── Use /score/upgrade page
        └── Select source rombel → target rombel → promote
        └── They stay ACTIVE, just different rombel

Step 3: Create new rombels for incoming students
        └── New Kelas X rombels for next year
```

---

## Files Reference

| Purpose  | Backend                              | Frontend               |
| -------- | ------------------------------------ | ---------------------- |
| Graduate | `services/graduate.services.js`      | `/siswa/[id]` (button) |
|          | `controllers/graduateController.js`  | `/siswa/alumni` (list) |
|          | `routes/api/graduate.js`             |                        |
| Promote  | `services/promotion.services.js`     | `/score/upgrade`       |
|          | `controllers/promotionController.js` |                        |
|          | `routes/api/promotion.js`            |                        |
| Mutasi   | `services/student.service.js`        | `/siswa/[id]` (button) |

---

## If You Want Simpler (DELETE approach)

You can simplify by:

1. Remove `student_history` table
2. Just DELETE from `students` and `rombel_students`
3. No alumni/mutasi pages needed

But you lose:

- Graduation records
- Historical data
- Audit trail

**Recommendation:** Keep the current system. It's not overengineered - it's what real schools need.

---

# Project Cleanup - Files to Delete

Last reviewed: 2026-02-01

## DELETE IMMEDIATELY (No dependencies)

### Duplicate/Unused Backend Services

- [ ] `backend/services/authService.js` - Duplicate of `auth.service.js` (unused)

### Unused Svelte Components

- [ ] `src/lib/components/input/inputMapel.svelte` - No imports anywhere
- [ ] `src/lib/components/layout/tableMapel.svelte` - No imports anywhere
- [ ] `src/lib/components/layout/classRegist.svelte` - No imports anywhere
- [ ] `src/lib/components/layout/waliBiodata.svelte` - No imports anywhere

### Orphaned Test Files (No test runner configured)

- [ ] `backend/utils/unit_test/rombel.services.test.js`
- [ ] `backend/utils/unit_test/score.services.test.js`
- [ ] `backend/utils/unit_test/student.bulk_upload.test.js`
- [ ] `backend/utils/unit_test/student.payload.test.js`

### Test Data/Utilities

- [ ] `backend/utils/testerAPI/test_scores.xlsx`
- [ ] `backend/utils/testerAPI/test_scores_upload.xlsx`
- [ ] `backend/utils/testerAPI/testscore.http`
- [ ] `backend/utils/testerAPI/generateTestExcel.js`
- [ ] `backend/utils/testerAPI/generateTestExcelbulkScore.js`

### IDE Cache (add to .gitignore)

- [ ] `.idea/httpRequests/` - Entire directory (49 files, IDE-generated)

### Empty/Redundant Files

- [ ] `siakad.db` - Empty SQLite file (0 bytes)

## CHOOSE ONE PACKAGE MANAGER

You have both npm and pnpm lock files. Pick one:

**Option A - Use pnpm (recommended, faster):**

- [ ] Delete `package-lock.json`

**Option B - Use npm:**

- [ ] Delete `pnpm-lock.yaml`
- [ ] Delete `pnpm-workspace.yaml`

## OPTIONAL CLEANUP

### Batch Scripts (Windows)

- [ ] `build.bat` - Has syntax error (`npm i run build` should be `npm run build`)
- [ ] `start.bat` - Outdated, delete if using IDE/terminal

### Documentation to Review/Consolidate

These feel like scattered notes - consider consolidating into README:

- `docs/TODO.md` - Minimal content
- `docs/claudeOpusexec.md` - Execution notes
- `docs/excelbulkInputplan.md` - Planning doc
- `docs/inputboxwhy.md` - Design notes
- `docs/modal.md`, `docs/modalpopupalert.md` - Duplicated

---

## Summary

| Category              | Count | Risk  |
| --------------------- | ----- | ----- |
| Duplicate Services    | 1     | LOW   |
| Unused Components     | 4     | LOW   |
| Orphaned Tests        | 4     | LOW   |
| Test Data/Utils       | 5     | LOW   |
| IDE Cache             | 49    | NONE  |
| Empty Files           | 1     | NONE  |
| Lock File Duplicates  | 1-2   | LOW   |
| Batch Scripts         | 2     | LOW   |

**Total: ~67 files safe to delete**

---

