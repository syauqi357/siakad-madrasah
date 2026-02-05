# API Test Documentation: Scoring System

This document outlines the successful tests performed on the Scoring System API using the `testscore.http` file.

## 1. Seeding the Database

Before testing, the database was populated using a seed script (`seed.js`). This ensured that all foreign key constraints would be met. The script created:
*   A test teacher and user.
*   Assessment types (UH1, UTS, UAS).
*   A grade level, subject, and the link between them (`class_subject`).
*   Three sample students.

## 2. Test Cases

### Test Case 1: Initial Data Fetch

*   **Request:** `GET /routes/api/score/scorebyclass?classSubjectId=1`
*   **Purpose:** To verify that the endpoint returns an empty data set before any scores are posted.
*   **Result:** **SUCCESS**. The API returned a `200 OK` with an empty `data` array.

### Test Case 2: Bulk Score Creation

*   **Request:** `POST /routes/api/score/scores`
*   **Body:**
    ```json
    {
      "classSubjectId": 1,
      "assessmentTypeId": 1,
      "scores": [
        { "studentId": 1, "score": 85.5 },
        { "studentId": 2, "score": 90 },
        { "studentId": 3, "score": 75 }
      ]
    }
    ```
*   **Purpose:** To insert scores for multiple students at once.
*   **Result:** **SUCCESS**. The API returned a `200 OK` with the message `"Scores saved successfully"`.

### Test Case 3: Verify Score Creation

*   **Request:** `GET /routes/api/score/scorebyclass?classSubjectId=1`
*   **Purpose:** To confirm that the scores posted in the previous step were saved correctly.
*   **Result:** **SUCCESS**. The API returned a `200 OK` with the student data, including a pivoted `scores` object showing the new grades.

### Test Case 4: Score Update (Upsert)

*   **Request:** `POST /routes/api/score/scores`
*   **Body:**
    ```json
    {
      "classSubjectId": 1,
      "assessmentTypeId": 1,
      "scores": [
        { "studentId": 1, "score": 95 }
      ]
    }
    ```
*   **Purpose:** To test the `ON CONFLICT DO UPDATE` (upsert) logic by changing an existing score.
*   **Result:** **SUCCESS**. The API returned a `200 OK`.

### Test Case 5: Verify Score Update

*   **Request:** `GET /routes/api/score/scorebyclass?classSubjectId=1`
*   **Purpose:** To confirm that the score for Student 1 was updated from `85.5` to `95`.
*   **Result:** **SUCCESS**. The API returned the updated data, showing `score: 95` for Student 1.

### Test Case 6: Error Handling (Bad Request)

*   **Request:** `POST /routes/api/score/scores` with an incomplete body.
*   **Purpose:** To ensure the API correctly handles invalid or missing request data.
*   **Result:** **SUCCESS**. The API returned a `400 Bad Request` with the message `"Invalid data provided"`.

## Conclusion

All primary test cases for the Scoring System API passed successfully. The system can correctly create, read, update, and handle errors for student scores.
