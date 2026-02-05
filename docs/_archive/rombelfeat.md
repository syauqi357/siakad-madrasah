# Rombel (Class Group) Feature Documentation

This document outlines the architectural insights and implementation plan for the **Rombel** (Rombongan Belajar) feature, which serves as the central "glue" connecting Students, Teachers, and Grade Levels.

## 1. Concept Overview

A **Rombel** represents a specific class instance for a specific academic year.
*   **Example:** "X-IPA-1 (2024/2025)"
*   **Components:**
    *   **Grade Level:** Class X (from `classes` table)
    *   **Academic Year:** 2024/2025 (from `academic_year` table)
    *   **Homeroom Teacher:** Pak Budi (from `teachers` table)
    *   **Students:** A list of enrolled students.

## 2. Database Schema Strategy

We currently have the `rombel` table defined in `src/db/schema/classGroup.js`.

### The "Student-Rombel" Relationship
To track which student belongs to which class, we have two options. **Option B is recommended** for a robust academic system.

*   **Option A: Direct Link (Simple)**
    *   Add `rombel_id` column to the `student` table.
    *   *Pros:* Easy to query.
    *   *Cons:* Cannot track history. When a student moves to Class XI, the record of them being in Class X is lost.

*   **Option B: History Table (Recommended)**
    *   Create a new table: `student_rombel_history` (or `student_class_enrollment`).
    *   Columns:
        *   `id` (PK)
        *   `student_id` (FK)
        *   `rombel_id` (FK)
        *   `status` (Enum: 'Active', 'Moved', 'Graduated', 'Dropped_Out')
    *   *Pros:* Complete academic history. Essential for generating transcripts later.

## 3. Feature Workflow (Implementation Plan)

### Phase 1: Rombel Management (Admin)
1.  **Create Rombel:**
    *   Input: Name ("X-A"), Grade Level, Academic Year, Wali Kelas.
    *   Action: Insert into `rombel` table.
2.  **View Rombels:**
    *   List all active classes for the current academic year.

### Phase 2: Student Enrollment (The "Moving" Logic)
1.  **Unassigned Students View:**
    *   Query students where `rombel_id` is NULL (or no active record in history).
2.  **Enrollment Action:**
    *   Select multiple students (checkboxes).
    *   Select target Rombel.
    *   **API:** `POST /api/rombel/enroll` -> Updates student records.

### Phase 3: Class Promotion (Kenaikan Kelas)
1.  **Bulk Move:**
    *   Select "X-A".
    *   Select "Pass" or "Retain" for each student.
    *   Move "Pass" students to "XI-A" (New Rombel).

## 4. API Endpoints Required

*   `GET /api/rombels` - List all class groups.
*   `POST /api/rombels` - Create a new class group.
*   `GET /api/rombels/:id/students` - Get students in a specific class.
*   `POST /api/rombels/:id/enroll` - Add students to this class.

## 5. Integration with Scoring
The Scoring System (`student_scores`) already links to `class_subject`.
*   **Logic:** A `class_subject` (e.g., Math for X-A) belongs to a `rombel` (X-A).
*   **Validation:** You can only give a score to a student if they are enrolled in the `rombel` associated with that `class_subject`.
