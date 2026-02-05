# Scoring System Documentation

This document outlines the architecture, API endpoints, and data flow for the Student Scoring System.

## 1. Database Schema Overview

The scoring system relies on the following tables:

*   **`student_scores`**: Stores the actual grades.
    *   `student_id`: Who got the grade.
    *   `class_subject_id`: Which subject (and teacher) the grade is for.
    *   `assessment_type_id`: What kind of grade (UH1, UTS, UAS).
    *   `score`: The numeric value (0-100).
*   **`assessment_type`**: Defines the types of assessments available (e.g., "Harian", "UTS", "UAS").
*   **`class_subject`**: Links a Subject to a Class (and optionally a Teacher).
*   **`student`**: The student profile.

## 2. API Endpoints

### A. Get Scores for a Class Subject
**Endpoint:** `GET /api/scores`

**Query Parameters:**
*   `classSubjectId` (required): ID of the `class_subject` being viewed.
*   `academicYearId` (optional): Filter by academic year.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "studentId": 1,
      "studentName": "Ahmad",
      "nisn": "1234567890",
      "scores": {
        "UH1": 85,
        "UH2": 90,
        "UTS": 88,
        "UAS": null
      }
    },
    ...
  ]
}
```

### B. Save/Update Scores
**Endpoint:** `POST /api/scores`

**Body:**
```json
{
  "classSubjectId": 10,
  "assessmentTypeId": 2, // e.g., ID for "UTS"
  "scores": [
    { "studentId": 1, "score": 85 },
    { "studentId": 2, "score": 90 }
  ]
}
```

**Logic:**
*   Iterates through the `scores` array.
*   Uses `ON CONFLICT` (upsert) logic:
    *   If a score exists for this Student + ClassSubject + AssessmentType, **UPDATE** it.
    *   If not, **INSERT** a new record.

## 3. Frontend Implementation Plan

1.  **Teacher Dashboard:**
    *   Select Class (Rombel).
    *   Select Subject.
2.  **Score Grid (Data Table):**
    *   Rows: Students.
    *   Columns: Assessment Types (UH1, UH2, UTS, UAS).
    *   Cells: Input fields for scores.
3.  **Actions:**
    *   "Save Changes" button sends the bulk update to the API.

## 4. Future Improvements
*   **Weighting:** Calculate final grades based on weights defined in `assessment_type` (e.g., UAS = 40%, UTS = 30%).
*   **Export:** Generate PDF/Excel report cards.
