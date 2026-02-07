# API Documentation - SIAKAD Madrasah

This document provides comprehensive documentation for all API endpoints in the SIAKAD-Madrasah system.

**Base URL**: `/routes/api`
**Authentication**: JWT Token (via `VERIFY_TOKEN_MIDDLEWARE`)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [School Data](#2-school-data)
3. [Student Data](#3-student-data)
4. [Teachers](#4-teachers)
5. [Subjects](#5-subjects)
6. [Classes](#6-classes)
7. [Class-Subject Assignment](#7-class-subject-assignment)
8. [Rombel](#8-rombel)
9. [Academic Years](#9-academic-years)
10. [Curriculum](#10-curriculum)
11. [Assessment Types](#11-assessment-types)
12. [Scores](#12-scores)
13. [Grade Promotion](#13-grade-promotion)
14. [Graduates/Alumni](#14-graduatesalumni)
15. [Audit Logs](#15-audit-logs)

---

## 1. Authentication

**Route file**: `backend/routes/api/auth.js`

| No  | Method | Endpoint                | Description              | Auth Required |
| --- | ------ | ----------------------- | ------------------------ | ------------- |
| 1   | `POST` | `/auth/login`           | User login               | No            |
| 2   | `POST` | `/auth/logout`          | User logout              | No            |
| 3   | `POST` | `/auth/change-password` | Change password          | Yes           |
| 4   | `GET`  | `/auth/profileUsers`    | Get current user profile | Yes           |

---

## 2. School Data

**Route file**: `backend/routes/api/schooldataNav.js`

| No  | Method | Endpoint           | Description                               | Auth Required |
| --- | ------ | ------------------ | ----------------------------------------- | ------------- |
| 1   | `GET`  | `/schoolData/`     | Get school data                           | Yes           |
| 2   | `POST` | `/schoolData/`     | Create school data                        | Yes           |
| 3   | `PUT`  | `/schoolData/`     | Update school data                        | Yes           |
| 4   | `POST` | `/schoolData/logo` | Upload school logo (multipart, 5MB limit) | Yes           |

---

## 3. Student Data

**Route file**: `backend/routes/api/student.js`

| No  | Method   | Endpoint                      | Description                                 | Auth Required |
| --- | -------- | ----------------------------- | ------------------------------------------- | ------------- |
| 1   | `GET`    | `/studentDataSet`             | Get all students                            | Yes           |
| 2   | `GET`    | `/studentDataSet/lite`        | Get lightweight student list (id + name)    | Yes           |
| 3   | `GET`    | `/studentDataSet/count`       | Get total student count                     | Yes           |
| 4   | `GET`    | `/studentDataSet/search`      | Search students by name, NISN, or NIS       | Yes           |
| 5   | `GET`    | `/studentDataSet/:id`         | Get single student by ID                    | Yes           |
| 6   | `GET`    | `/students/active`            | Get active students                         | Yes           |
| 7   | `GET`    | `/students/dropout`           | Get dropout students                        | Yes           |
| 8   | `GET`    | `/students/graduated`         | Get graduated students                      | Yes           |
| 9   | `POST`   | `/students`                   | Create new student                          | Yes           |
| 10  | `POST`   | `/students/upload-bulk`       | Bulk import students from Excel             | Yes           |
| 11  | `GET`    | `/students/download-template` | Download Excel template for bulk import     | Yes           |
| 12  | `PUT`    | `/students/:id`               | Update student                              | Yes           |
| 13  | `DELETE` | `/students/:id`               | Delete student                              | Yes           |
| 14  | `POST`   | `/students/:id/status`        | Change student status                       | Yes           |
| 15  | `POST`   | `/students/:id/photo`         | Upload student photo (multipart, 2MB limit) | Yes           |

---

## 4. Teachers

**Route file**: `backend/routes/api/teacher.js`

| No  | Method   | Endpoint         | Description                                  | Auth Required |
| --- | -------- | ---------------- | -------------------------------------------- | ------------- |
| 1   | `GET`    | `/teachers`      | Get all teachers (full details)              | Yes           |
| 2   | `GET`    | `/teachers/list` | Get lightweight teacher list (id + fullName) | Yes           |
| 3   | `GET`    | `/teachers/:id`  | Get single teacher                           | Yes           |
| 4   | `POST`   | `/teachers`      | Create new teacher                           | Yes           |
| 5   | `PUT`    | `/teachers/:id`  | Update teacher                               | Yes           |
| 6   | `DELETE` | `/teachers/:id`  | Delete teacher                               | Yes           |

---

## 5. Subjects

**Route file**: `backend/routes/api/subject.js`

| No  | Method   | Endpoint          | Description              | Auth Required |
| --- | -------- | ----------------- | ------------------------ | ------------- |
| 1   | `GET`    | `/subjects`       | Get all subjects         | Yes           |
| 2   | `GET`    | `/subjects/count` | Get total subjects count | Yes           |
| 3   | `GET`    | `/subjects/:id`   | Get subject by ID        | Yes           |
| 4   | `POST`   | `/subjects`       | Create new subject       | Yes           |
| 5   | `PUT`    | `/subjects/:id`   | Update subject           | Yes           |
| 6   | `DELETE` | `/subjects/:id`   | Delete subject           | Yes           |

---

## 6. Classes

**Route file**: `backend/routes/api/classData.js`

| No  | Method   | Endpoint                    | Description          | Auth Required |
| --- | -------- | --------------------------- | -------------------- | ------------- |
| 1   | `POST`   | `/class-data/academic-year` | Create academic year | Yes           |
| 2   | `GET`    | `/class-data/classes`       | Get all classes      | Yes           |
| 3   | `POST`   | `/class-data/classes`       | Create new class     | Yes           |
| 4   | `PUT`    | `/class-data/classes/:id`   | Update class         | Yes           |
| 5   | `DELETE` | `/class-data/classes/:id`   | Delete class         | Yes           |

---

## 7. Class-Subject Assignment

**Route file**: `backend/routes/api/classSubject.js`

| No  | Method   | Endpoint                              | Description                         | Auth Required |
| --- | -------- | ------------------------------------- | ----------------------------------- | ------------- |
| 1   | `GET`    | `/class-subjects`                     | List all class-subject assignments  | Yes           |
| 2   | `GET`    | `/class-subjects/dropdown/classes`    | Get classes dropdown                | Yes           |
| 3   | `GET`    | `/class-subjects/dropdown/subjects`   | Get subjects dropdown               | Yes           |
| 4   | `GET`    | `/class-subjects/dropdown/teachers`   | Get teachers dropdown               | Yes           |
| 5   | `GET`    | `/class-subjects/unassigned/:classId` | Get unassigned subjects for a class | Yes           |
| 6   | `GET`    | `/class-subjects/:id`                 | Get single class-subject assignment | Yes           |
| 7   | `POST`   | `/class-subjects`                     | Create new class-subject assignment | Yes           |
| 8   | `PUT`    | `/class-subjects/:id`                 | Update class-subject assignment     | Yes           |
| 9   | `DELETE` | `/class-subjects/:id`                 | Delete class-subject assignment     | Yes           |

**Query Parameters**:

- `GET /class-subjects?classId=1` - Filter by class ID

---

## 8. Rombel

**Route file**: `backend/routes/api/rombel.js`

| No  | Method | Endpoint      | Description         | Auth Required |
| --- | ------ | ------------- | ------------------- | ------------- |
| 1   | `POST` | `/rombel`     | Create a new Rombel | Yes           |
| 2   | `GET`  | `/rombel`     | Get all Rombels     | Yes           |
| 3   | `GET`  | `/rombel/:id` | Get Rombel details  | Yes           |

---

## 9. Academic Years

**Route file**: `backend/routes/api/academicYear.js`

| No  | Method   | Endpoint                 | Description                                    | Auth Required |
| --- | -------- | ------------------------ | ---------------------------------------------- | ------------- |
| 1   | `GET`    | `/academic-years`        | Get all academic years                         | Yes           |
| 2   | `GET`    | `/academic-years/lite`   | Get lightweight academic years (for dropdowns) | Yes           |
| 3   | `GET`    | `/academic-years/active` | Get active academic year                       | Yes           |
| 4   | `GET`    | `/academic-years/:id`    | Get single academic year                       | Yes           |
| 5   | `POST`   | `/academic-years`        | Create new academic year                       | Yes           |
| 6   | `PUT`    | `/academic-years/:id`    | Update academic year                           | Yes           |
| 7   | `DELETE` | `/academic-years/:id`    | Delete academic year                           | Yes           |

---

## 10. Curriculum

**Route file**: `backend/routes/api/curriculum.js`

| No  | Method   | Endpoint             | Description                               | Auth Required |
| --- | -------- | -------------------- | ----------------------------------------- | ------------- |
| 1   | `GET`    | `/curriculum`        | Get all curricula                         | Yes           |
| 2   | `GET`    | `/curriculum/lite`   | Get lightweight curricula (for dropdowns) | Yes           |
| 3   | `GET`    | `/curriculum/active` | Get active curriculum                     | Yes           |
| 4   | `GET`    | `/curriculum/:id`    | Get single curriculum                     | Yes           |
| 5   | `POST`   | `/curriculum`        | Create new curriculum                     | Yes           |
| 6   | `PUT`    | `/curriculum/:id`    | Update curriculum                         | Yes           |
| 7   | `DELETE` | `/curriculum/:id`    | Delete curriculum                         | Yes           |

---

## 11. Assessment Types

**Route file**: `backend/routes/api/assessmentType.js`

| No  | Method   | Endpoint                       | Description                        | Auth Required |
| --- | -------- | ------------------------------ | ---------------------------------- | ------------- |
| 1   | `GET`    | `/assessment-types`            | Get all assessment types           | Yes           |
| 2   | `GET`    | `/assessment-types/lite`       | Get assessment types for dropdowns | Yes           |
| 3   | `GET`    | `/assessment-types/stats`      | Get assessment type statistics     | Yes           |
| 4   | `GET`    | `/assessment-types/:id`        | Get single assessment type         | Yes           |
| 5   | `POST`   | `/assessment-types`            | Create new assessment type         | Yes           |
| 6   | `PUT`    | `/assessment-types/:id`        | Update assessment type             | Yes           |
| 7   | `PATCH`  | `/assessment-types/:id/toggle` | Toggle assessment type status      | Yes           |
| 8   | `DELETE` | `/assessment-types/:id`        | Delete assessment type             | Yes           |

---

## 12. Scores

**Route file**: `backend/routes/api/scores.js`

| No  | Method | Endpoint                            | Description                                 | Auth Required |
| --- | ------ | ----------------------------------- | ------------------------------------------- | ------------- |
| 1   | `GET`  | `/score/template/:rombelId`         | Download Excel score template for a rombel  | Yes           |
| 2   | `GET`  | `/score/subjects/:rombelId`         | Get subjects for a rombel (simple selector) | Yes           |
| 3   | `GET`  | `/score/class-subjects`             | Get class subjects for score entry          | Yes           |
| 4   | `GET`  | `/score/scorebyclass`               | Get scores by class                         | Yes           |
| 5   | `POST` | `/score/scores`                     | Save scores                                 | Yes           |
| 6   | `POST` | `/score/upload`                     | Upload scores from Excel (multipart)        | Yes           |
| 7   | `POST` | `/score/upload-bulk`                | Bulk upload pivot table scores from Excel   | Yes           |
| 8   | `GET`  | `/score/student/:studentId/summary` | Get score summary for a student             | Yes           |
| 9   | `GET`  | `/score/rombel/:rombelId/report`    | Get complete score report for a rombel      | Yes           |

---

## 13. Grade Promotion

**Route file**: `backend/routes/api/promotion.js`

| No  | Method | Endpoint                        | Description                         | Auth Required |
| --- | ------ | ------------------------------- | ----------------------------------- | ------------- |
| 1   | `GET`  | `/promotion/rombels`            | Get rombels available for promotion | Yes           |
| 2   | `GET`  | `/promotion/academic-years`     | Get academic years for promotion    | Yes           |
| 3   | `GET`  | `/promotion/class-levels`       | Get class levels                    | Yes           |
| 4   | `GET`  | `/promotion/students/:rombelId` | Get students from a specific rombel | Yes           |
| 5   | `GET`  | `/promotion/targets/:classId`   | Get target rombels for promotion    | Yes           |
| 6   | `POST` | `/promotion/promote`            | Promote students to new rombel      | Yes           |

---

## 14. Graduates/Alumni

**Route file**: `backend/routes/api/graduate.js`

| No  | Method | Endpoint           | Description                                | Auth Required |
| --- | ------ | ------------------ | ------------------------------------------ | ------------- |
| 1   | `GET`  | `/graduates`       | List all alumni with pagination            | Yes           |
| 2   | `GET`  | `/graduates/stats` | Get alumni statistics (total, by year)     | Yes           |
| 3   | `GET`  | `/graduates/years` | Get distinct graduation years for dropdown | Yes           |
| 4   | `GET`  | `/graduates/:id`   | Get single alumni detail                   | Yes           |
| 5   | `POST` | `/graduates/bulk`  | Bulk graduate multiple students            | Yes           |
| 6   | `POST` | `/graduates/:id`   | Graduate a single student                  | Yes           |
| 7   | `PUT`  | `/graduates/:id`   | Update alumni data                         | Yes           |

**Query Parameters**:

- `GET /graduates?page=1&limit=10&year=2024` - Pagination and filter by year

**Request Body for POST /graduates/:id**:

```json
{
	"completionDate": "2024-06-15",
	"graduationYear": 2024,
	"certificateNumber": "CERT-001",
	"finalGrade": "A",
	"scores": []
}
```

---

## 15. Audit Logs

**Route file**: `backend/routes/auditLog/audit_logs.js`

| No  | Method | Endpoint          | Description                   | Auth Required |
| --- | ------ | ----------------- | ----------------------------- | ------------- |
| 1   | `GET`  | `/audit-logs`     | Fetch audit logs with filters | Yes           |
| 2   | `GET`  | `/audit-logs/:id` | Get single audit log by ID    | Yes           |

**Query Parameters**:

- `type` - Filter by log type
- `user` - Filter by user
- `status` - Filter by status
- `search` - Search term
- `timeRange` - Filter by time range

---

## Summary

| Category                 | Endpoints |
| ------------------------ | --------- |
| Authentication           | 4         |
| School Data              | 4         |
| Student Data             | 15        |
| Teachers                 | 6         |
| Subjects                 | 6         |
| Classes                  | 5         |
| Class-Subject Assignment | 9         |
| Rombel                   | 3         |
| Academic Years           | 7         |
| Curriculum               | 7         |
| Assessment Types         | 8         |
| Scores                   | 9         |
| Grade Promotion          | 6         |
| Graduates/Alumni         | 7         |
| Audit Logs               | 2         |
| **Total**                | **98**    |

---

## Key Features

- **File Uploads**: Student photos (2MB), School logos (5MB), Excel imports
- **Excel Integration**: Bulk import/export for students and scores
- **Audit Logging**: All API requests are logged
- **Rate Limiting**: Global rate limiting enabled
- **Authentication**: JWT token-based authentication
- **Hierarchical Data**: Academic Years → Classes → Students → Scores
