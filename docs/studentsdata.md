# Student Data Architecture & Issues

This document tracks the current state, known issues, and future plans for the Student Data module.

## Current State
The student profile page (`/siswa/[id]`) fetches data from `GET /api/studentDataSet/:id`.
Currently, it displays basic information like Name, NISN, and Gender.

## Known Issues

### 1. Missing Class Name (The "Rombel" Link)
**Symptom:** The "Kelas" field on the student detail page might show "Unknown", "-", or be empty, even if the class exists in the database.

**Root Cause:**
The current API endpoint (`studentController.js` -> `getStudentById`) likely fetches only from the `student` table. It does not perform a `JOIN` with the `rombel` or `classes` table to retrieve the human-readable class name (e.g., "X-IPA-1").

**Solution (To Be Implemented):**
Update the `getStudentById` service function to include a `LEFT JOIN`:

```javascript
// Conceptual Drizzle Query
const student = await db
    .select({
        ...studentTable,
        className: rombel.name, // Fetch the name from the joined table
        gradeLevel: classes.className
    })
    .from(studentTable)
    .leftJoin(rombel, eq(studentTable.rombelId, rombel.id)) // Link Student -> Rombel
    .leftJoin(classes, eq(rombel.classId, classes.id))      // Link Rombel -> Grade Level
    .where(eq(studentTable.id, studentId));
```

### 2. Parent Data Separation
**Current:** Parent names might be hardcoded or fetched from flat columns.
**Future:** Ensure `student_father` and `student_mother` tables are also joined if they are separate tables, or ensure the flat columns in `student` are populated correctly.

## Future Improvements
*   **Student History:** Implement the `student_rombel_history` table (as detailed in `rombelfeat.md`) to track class changes over time.
*   **Transcript Generation:** Once the Class/Rombel link is fixed, we can generate transcripts by querying `student_scores` filtered by `rombel_id`.
