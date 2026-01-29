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

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/students/graduated` | List all alumni (paginated) |
| GET | `/students/graduated?year=2025` | Filter by graduation year |
| POST | `/students/:id/status` | Graduate a student |

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