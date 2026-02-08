# API JSON Payload Documentation

> Complete reference for all SIAKAD-MADRASAH API endpoints, request payloads, and response shapes.

---

## Table of Contents

| No  | Module                                                   | Base Path                      | Endpoints |
| --- | -------------------------------------------------------- | ------------------------------ | --------- |
| 1   | [Authentication](#1-authentication)                      | `/routes/api/auth`             | 4         |
| 2   | [School Data](#2-school-data)                            | `/routes/api/schoolData`       | 4         |
| 3   | [Students](#3-students)                                  | `/routes/api/students`         | 14        |
| 4   | [Academic Year](#4-academic-year)                        | `/routes/api/academic-years`   | 6         |
| 5   | [Curriculum](#5-curriculum)                              | `/routes/api/curriculum`       | 6         |
| 6   | [Assessment Types](#6-assessment-types)                  | `/routes/api/assessment-types` | 7         |
| 7   | [Subjects](#7-subjects)                                  | `/routes/api/subjects`         | 5         |
| 8   | [Teachers](#8-teachers)                                  | `/routes/api/teachers`         | 5         |
| 9   | [Class Data](#9-class-data)                              | `/routes/api/class-data`       | 4         |
| 10  | [Class-Subject Assignment](#10-class-subject-assignment) | `/routes/api/class-subjects`   | 8         |
| 11  | [Rombel (Class Group)](#11-rombel-class-group)           | `/routes/api/rombel`           | 4         |
| 12  | [Scores](#12-scores)                                     | `/routes/api/score`            | 8         |
| 13  | [Promotion](#13-promotion)                               | `/routes/api/promotion`        | 5         |
| 14  | [Graduate / Alumni](#14-graduate--alumni)                | `/routes/api/graduates`        | 7         |
| 15  | [Audit Logs](#15-audit-logs)                             | `/routes/api/audit-logs`       | 2         |

---

## 1. Authentication

**Base Path:** `/routes/api/auth`

### POST `/routes/api/auth/login`

Login with username and password.

**Request Body:**

```json
{
	"username": "string",
	"password": "string"
}
```

**Response (200):**

```json
{
	"success": true,
	"message": "Login successful",
	"token": "JWT_TOKEN_STRING",
	"user": {
		"id": 1,
		"username": "string",
		"role": "string",
		"email": "string"
	}
}
```

---

### POST `/routes/api/auth/logout`

Logout user (client-side token removal).

**Request Body:** _empty_

**Response (200):**

```json
{
	"success": true,
	"message": "Logout successful"
}
```

---

### POST `/routes/api/auth/change-password`

Change authenticated user's password. **Requires JWT token.**

**Request Body:**

```json
{
	"currentPassword": "string",
	"newPassword": "string (min 6 chars, must differ from current)"
}
```

**Response (200):**

```json
{
	"success": true,
	"message": "Password changed successfully"
}
```

---

### GET `/routes/api/auth/profileUsers`

Get current authenticated user profile. **Requires JWT token.**

**Response (200):**

```json
{
	"success": true,
	"user": {
		"id": 1,
		"username": "string",
		"role": "string",
		"email": "string"
	}
}
```

---

## 2. School Data

**Base Path:** `/routes/api/schoolData`

### GET `/routes/api/schoolData`

Get school information (single record).

**Response (200):**

```json
{
	"id": 1,
	"name": "string",
	"npsn": "string",
	"nsm": "string",
	"akreditasi": "string",
	"alamat": "string",
	"kota": "string",
	"negara": "string",
	"logoUrl": "string"
}
```

---

### POST `/routes/api/schoolData`

Create school data (only one record allowed).

**Request Body:**

```json
{
	"name": "string (required)",
	"npsn": "string",
	"nsm": "string",
	"akreditasi": "string",
	"alamat": "string",
	"kota": "string",
	"negara": "string"
}
```

**Response (201):**

```json
{
  "message": "School data created successfully",
  "data": { "...school data" }
}
```

---

### PUT `/routes/api/schoolData`

Update school data.

**Request Body:**

```json
{
	"name": "string",
	"npsn": "string",
	"nsm": "string",
	"akreditasi": "string",
	"alamat": "string",
	"kota": "string",
	"negara": "string"
}
```

**Response (200):**

```json
{
  "message": "School data updated successfully",
  "data": { "...updated school data" }
}
```

---

### POST `/routes/api/schoolData/logo`

Upload school logo. **Content-Type:** `multipart/form-data`

| Field  | Type | Constraint                    |
| ------ | ---- | ----------------------------- |
| `logo` | file | 5MB max, jpg/png/gif/svg/webp |

**Response (200):**

```json
{
	"message": "Logo uploaded successfully",
	"logoUrl": "string"
}
```

---

## 3. Students

**Base Path:** `/routes/api`

### GET `/routes/api/studentDataSet`

Get all students with pagination.

| Query Param | Type   | Default |
| ----------- | ------ | ------- |
| `page`      | number | 1       |
| `limit`     | number | 5       |

**Response (200):**

```json
{
	"data": [
		{
			"id": 1,
			"studentName": "string",
			"nisn": 1234567890,
			"localNis": 12345,
			"gender": "laki-laki | Perempuan",
			"religion": "string",
			"birthPlace": "string",
			"birthDate": "YYYY-MM-DD",
			"phoneNumber": "string",
			"childOrder": 1,
			"siblingsCount": 2,
			"nationality": "string",
			"livingWith": "string",
			"transportation": "string",
			"bpjs": "string",
			"idCardNumber": "string",
			"birthCertificateNumber": "string",
			"previousSchool": "string",
			"profilePhoto": "string (URL)",
			"rombelId": 1,
			"status": "ACTIVE | MUTASI | GRADUATE",
			"createdAt": "ISO datetime",
			"updatedAt": "ISO datetime"
		}
	],
	"pagination": {
		"total": 100,
		"page": 1,
		"limit": 5,
		"totalPages": 20
	}
}
```

---

### GET `/routes/api/studentDataSet/lite`

Lightweight student list (for dropdowns).

**Response (200):**

```json
[
	{
		"id": 1,
		"studentName": "string",
		"nisn": 1234567890
	}
]
```

---

### GET `/routes/api/studentDataSet/count`

Get total student count.

**Response (200):**

```json
{
	"count": 100
}
```

---

### GET `/routes/api/studentDataSet/search`

Search students by name, NISN, or NIS.

| Query Param | Type   | Default | Required                      |
| ----------- | ------ | ------- | ----------------------------- |
| `q`         | string | -       | yes                           |
| `page`      | number | 1       | no                            |
| `limit`     | number | 10      | no                            |
| `status`    | string | -       | no (ACTIVE, MUTASI, GRADUATE) |

**Response (200):**

```json
{
	"data": ["...student objects"],
	"query": "search term",
	"status": "ACTIVE",
	"pagination": {
		"page": 1,
		"limit": 10
	}
}
```

---

### GET `/routes/api/studentDataSet/:id`

Get student details by ID.

**Response (200):** Single student object (same shape as list item above).

---

### GET `/routes/api/students/active`

Get all active students.

**Response (200):** Array of student objects with `status = "ACTIVE"`.

---

### GET `/routes/api/students/dropout`

Get all dropout/mutasi students.

**Response (200):** Array of student objects with `status = "MUTASI"`.

---

### GET `/routes/api/students/graduated`

Get all graduated students.

**Response (200):** Array of student objects with `status = "GRADUATE"`.

---

### POST `/routes/api/students`

Create a new student with full family and address data.

**Request Body:**

```json
{
	"studentName": "string (required)",
	"nisn": 1234567890,
	"localNis": 12345,
	"gender": "laki-laki | Perempuan",
	"religion": "string",
	"birthPlace": "string",
	"birthDate": "YYYY-MM-DD",
	"phoneNumber": "string",
	"childOrder": 1,
	"siblingsCount": 2,
	"nationality": "string",
	"livingWith": "string",
	"transportation": "string",
	"bpjs": "string",
	"idCardNumber": "string",
	"birthCertificateNumber": "string",
	"previousSchool": "string",
	"rombelId": 1,
	"status": "ACTIVE",

	"address": {
		"street": "string",
		"houseNumber": "string",
		"rt": "string",
		"rw": "string",
		"village": "string",
		"subDistrict": "string",
		"district": "string",
		"province": "string",
		"postalCode": "string"
	},

	"father": {
		"name": "string",
		"nik": "string",
		"job": "string",
		"phone": "string",
		"birthPlace": "string",
		"birthDate": "YYYY-MM-DD",
		"birthYear": 1975,
		"education": "string",
		"monthlyIncome": "string",
		"isAlive": true
	},

	"mother": {
		"name": "string",
		"nik": "string",
		"job": "string",
		"phone": "string",
		"birthPlace": "string",
		"birthDate": "YYYY-MM-DD",
		"birthYear": 1978,
		"education": "string",
		"monthlyIncome": "string",
		"isAlive": true
	},

	"guardian": {
		"name": "string",
		"nik": "string",
		"job": "string",
		"phone": "string",
		"relationship": "string"
	}
}
```

**Response (201):** Created student object.

---

### PUT `/routes/api/students/:id`

Update student data (partial updates allowed).

**Request Body:** Same structure as POST (all fields optional).

**Response (200):** Updated student object.

---

### DELETE `/routes/api/students/:id`

Delete a student.

**Response (200):**

```json
{
	"message": "Student deleted successfully"
}
```

---

### POST `/routes/api/students/:id/status`

Change student status.

**Request Body:**

```json
{
	"status": "ACTIVE | MUTASI | GRADUATE"
}
```

**Response (200):** Updated student object.

---

### POST `/routes/api/students/:id/photo`

Upload student profile photo. **Content-Type:** `multipart/form-data`

| Field   | Type | Constraint            |
| ------- | ---- | --------------------- |
| `photo` | file | 2MB max, jpg/png/webp |

**Response (200):**

```json
{
	"message": "Photo uploaded successfully",
	"filename": "string"
}
```

---

### POST `/routes/api/students/upload-bulk`

Bulk upload students from Excel. **Content-Type:** `multipart/form-data`

| Field  | Type | Constraint  |
| ------ | ---- | ----------- |
| `file` | file | Excel .xlsx |

**Required Excel columns:**

```
Nama Siswa, NISN, NIS Lokal, NIK / No. KTP, No. Akta Kelahiran,
Jenis Kelamin (L/P), Tempat Lahir, Tanggal Lahir, Anak Ke-,
Jumlah Saudara, Kewarganegaraan, Agama, No. HP Siswa,
Sekolah Sebelumnya, Tinggal Bersama, Transportasi, No. BPJS,
Alamat - Jalan, Alamat - No. Rumah, Alamat - RT, Alamat - RW,
Alamat - Desa/Kelurahan, Alamat - Kecamatan, Alamat - Kab/Kota,
Alamat - Provinsi, Alamat - Kode Pos,
Ayah - Nama, Ayah - NIK, Ayah - Pekerjaan, Ayah - No. HP,
Ayah - Tempat Lahir, Ayah - Tanggal Lahir, Ayah - Tahun Lahir,
Ayah - Pendidikan, Ayah - Penghasilan, Ayah - Status Hidup (1/0),
Ibu - Nama, Ibu - NIK, Ibu - Pekerjaan, Ibu - No. HP,
Ibu - Tempat Lahir, Ibu - Tanggal Lahir, Ibu - Tahun Lahir,
Ibu - Pendidikan, Ibu - Penghasilan, Ibu - Status Hidup (1/0)
```

---

### GET `/routes/api/students/download-template`

Download blank Excel template for bulk upload.

**Response:** Excel file (.xlsx).

---

## 4. Academic Year

**Base Path:** `/routes/api/academic-years`

### GET `/routes/api/academic-years`

Get all academic years.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "2024/2025",
			"startYear": 2024,
			"endYear": 2025,
			"startDate": "2024-07-15",
			"endDate": "2025-06-30",
			"isActive": true
		}
	]
}
```

---

### GET `/routes/api/academic-years/lite`

Lightweight list for dropdowns.

**Response (200):**

```json
{
	"success": true,
	"data": [{ "id": 1, "name": "2024/2025" }]
}
```

---

### GET `/routes/api/academic-years/active`

Get the currently active academic year.

**Response (200):**

```json
{
	"success": true,
	"data": {
		"id": 1,
		"name": "2024/2025",
		"startYear": 2024,
		"endYear": 2025,
		"startDate": "2024-07-15",
		"endDate": "2025-06-30",
		"isActive": true
	}
}
```

---

### GET `/routes/api/academic-years/:id`

Get single academic year by ID.

**Response (200):**

```json
{
  "success": true,
  "data": { "...academic year object" }
}
```

---

### POST `/routes/api/academic-years`

Create new academic year.

**Request Body:**

```json
{
	"name": "2024/2025 (required, unique)",
	"startYear": 2024,
	"endYear": 2025,
	"startDate": "2024-07-15",
	"endDate": "2025-06-30",
	"isActive": false
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Tahun ajaran berhasil dibuat",
  "data": { "...created academic year" }
}
```

---

### PUT `/routes/api/academic-years/:id`

Update academic year.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Tahun ajaran berhasil diupdate",
  "data": { "...updated academic year" }
}
```

---

### DELETE `/routes/api/academic-years/:id`

Delete academic year.

**Response (200):**

```json
{
	"success": true,
	"message": "Tahun ajaran berhasil dihapus"
}
```

---

## 5. Curriculum

**Base Path:** `/routes/api/curriculum`

### GET `/routes/api/curriculum`

Get all curricula.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Kurikulum Merdeka",
			"code": "KM-2024",
			"year": 2024,
			"description": "string",
			"isActive": true
		}
	]
}
```

---

### GET `/routes/api/curriculum/lite`

Lightweight list for dropdowns.

**Response (200):** Same shape, lighter weight.

---

### GET `/routes/api/curriculum/active`

Get the active curriculum.

**Response (200):**

```json
{
  "success": true,
  "data": { "...curriculum object" }
}
```

---

### GET `/routes/api/curriculum/:id`

Get single curriculum by ID.

**Response (200):**

```json
{
  "success": true,
  "data": { "...curriculum object" }
}
```

---

### POST `/routes/api/curriculum`

Create new curriculum.

**Request Body:**

```json
{
	"name": "string (required)",
	"code": "string (required, unique)",
	"year": 2024,
	"description": "string",
	"isActive": false
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Kurikulum berhasil dibuat",
  "data": { "...created curriculum" }
}
```

---

### PUT `/routes/api/curriculum/:id`

Update curriculum.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Kurikulum berhasil diupdate",
  "data": { "...updated curriculum" }
}
```

---

### DELETE `/routes/api/curriculum/:id`

Delete curriculum.

**Response (200):**

```json
{
	"success": true,
	"message": "Kurikulum berhasil dihapus"
}
```

---

## 6. Assessment Types

**Base Path:** `/routes/api/assessment-types`

### GET `/routes/api/assessment-types`

Get all assessment types with pagination.

| Query Param  | Type    | Default |
| ------------ | ------- | ------- |
| `page`       | number  | 1       |
| `limit`      | number  | 10      |
| `activeOnly` | boolean | false   |

**Response (200):**

```json
{
	"data": [
		{
			"id": 1,
			"name": "Ulangan Harian 1",
			"code": "UH1",
			"description": "string",
			"isActive": true,
			"weight": 30
		}
	],
	"pagination": {
		"total": 10,
		"page": 1,
		"limit": 10,
		"totalPages": 1
	}
}
```

---

### GET `/routes/api/assessment-types/lite`

Active assessment types for dropdowns.

**Response (200):**

```json
[{ "id": 1, "name": "Ulangan Harian 1" }]
```

---

### GET `/routes/api/assessment-types/stats`

Assessment type statistics.

**Response (200):**

```json
{
	"total": 10,
	"active": 8,
	"byType": {}
}
```

---

### GET `/routes/api/assessment-types/:id`

Get single assessment type.

**Response (200):**

```json
{
	"id": 1,
	"name": "Ulangan Harian 1",
	"code": "UH1",
	"description": "string",
	"isActive": true,
	"weight": 30
}
```

---

### POST `/routes/api/assessment-types`

Create new assessment type.

**Request Body:**

```json
{
	"name": "Ulangan Harian 1 (required)",
	"code": "UH1 (required, unique)",
	"description": "string",
	"isActive": true,
	"weight": 30
}
```

**Response (201):**

```json
{
  "message": "Jenis penilaian berhasil ditambahkan",
  "data": { "...created assessment type" }
}
```

---

### PUT `/routes/api/assessment-types/:id`

Update assessment type.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "message": "Jenis penilaian berhasil diperbarui",
  "data": { "...updated assessment type" }
}
```

---

### PATCH `/routes/api/assessment-types/:id/toggle`

Toggle active/inactive status.

**Request Body:** _empty_

**Response (200):**

```json
{
  "message": "Status berhasil diubah menjadi Aktif",
  "data": { "...updated assessment type" }
}
```

---

### DELETE `/routes/api/assessment-types/:id`

Delete assessment type (only if not used by any scores).

**Response (200):**

```json
{
	"message": "Jenis penilaian berhasil dihapus"
}
```

---

## 7. Subjects

**Base Path:** `/routes/api/subjects`

### GET `/routes/api/subjects`

Get all subjects.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Matematika",
			"subjectCode": "MTK",
			"description": "string",
			"kkm": 75
		}
	]
}
```

---

### GET `/routes/api/subjects/count`

Get total subject count.

**Response (200):**

```json
{
	"success": true,
	"data": { "count": 12 }
}
```

---

### GET `/routes/api/subjects/:id`

Get single subject.

**Response (200):**

```json
{
  "success": true,
  "data": { "...subject object" }
}
```

---

### POST `/routes/api/subjects`

Create new subject.

**Request Body:**

```json
{
	"name": "Matematika (required, unique)",
	"subjectCode": "MTK (unique)",
	"description": "string",
	"kkm": 75
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": { "...created subject" }
}
```

---

### PUT `/routes/api/subjects/:id`

Update subject.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Subject updated successfully",
  "data": { "...updated subject" }
}
```

---

### DELETE `/routes/api/subjects/:id`

Delete subject.

**Response (200):**

```json
{
	"success": true,
	"message": "Subject deleted successfully"
}
```

---

## 8. Teachers

**Base Path:** `/routes/api/teachers`

### GET `/routes/api/teachers`

Get all teachers with full details.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"userId": 5,
			"nip": "string",
			"fullName": "string",
			"gender": "male | female",
			"birthPlace": "string",
			"birthDate": "YYYY-MM-DD",
			"religion": "string",
			"phoneNumber": "string",
			"personalEmail": "string",
			"profilePhoto": "string (URL)"
		}
	]
}
```

---

### GET `/routes/api/teachers/list`

Lightweight list for dropdowns (id + fullName only).

**Response (200):**

```json
{
	"success": true,
	"data": [{ "id": 1, "fullName": "Ahmad S.Pd" }]
}
```

---

### GET `/routes/api/teachers/:id`

Get single teacher.

**Response (200):**

```json
{
  "success": true,
  "data": { "...teacher object (full details)" }
}
```

---

### POST `/routes/api/teachers`

Create new teacher.

**Request Body:**

```json
{
	"fullName": "string (required)",
	"nip": "string (unique, optional)",
	"gender": "male | female",
	"birthPlace": "string",
	"birthDate": "YYYY-MM-DD",
	"religion": "string",
	"phoneNumber": "string",
	"personalEmail": "string",
	"userId": 5
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": { "...created teacher" }
}
```

---

### PUT `/routes/api/teachers/:id`

Update teacher.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Teacher updated successfully",
  "data": { "...updated teacher" }
}
```

---

### DELETE `/routes/api/teachers/:id`

Delete teacher.

**Response (200):**

```json
{
	"success": true,
	"message": "Teacher deleted successfully"
}
```

---

## 9. Class Data

**Base Path:** `/routes/api/class-data`

### GET `/routes/api/class-data/classes`

Get all classes.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"className": "Kelas 1",
			"classLevel": 1,
			"isFinalGrade": false,
			"academicYearId": 1,
			"curriculumId": 1,
			"capacity": 30,
			"createdAt": "ISO datetime",
			"updatedAt": "ISO datetime"
		}
	]
}
```

---

### POST `/routes/api/class-data/classes`

Create new class.

**Request Body:**

```json
{
	"className": "Kelas 1 (required)",
	"classLevel": 1,
	"isFinalGrade": false,
	"academicYearId": 1,
	"curriculumId": 1,
	"capacity": 30
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Class created successfully",
  "data": { "...created class" }
}
```

---

### PUT `/routes/api/class-data/classes/:id`

Update class.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Class updated successfully",
  "data": { "...updated class" }
}
```

---

### DELETE `/routes/api/class-data/classes/:id`

Delete class.

**Response (200):**

```json
{
  "success": true,
  "message": "Class deleted successfully",
  "data": { "...deleted class" }
}
```

---

## 10. Class-Subject Assignment

**Base Path:** `/routes/api/class-subjects`

### GET `/routes/api/class-subjects`

Get all class-subject assignments.

| Query Param | Type   | Required             |
| ----------- | ------ | -------------------- |
| `classId`   | number | no (filter by class) |

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"classId": 1,
			"subjectId": 3,
			"teacherId": 2,
			"className": "Kelas 1",
			"subjectName": "Matematika",
			"teacherName": "Ahmad S.Pd"
		}
	]
}
```

---

### GET `/routes/api/class-subjects/dropdown/classes`

Classes dropdown.

**Response (200):**

```json
[{ "id": 1, "className": "Kelas 1" }]
```

---

### GET `/routes/api/class-subjects/dropdown/subjects`

Subjects dropdown.

**Response (200):**

```json
[{ "id": 1, "name": "Matematika" }]
```

---

### GET `/routes/api/class-subjects/dropdown/teachers`

Teachers dropdown.

**Response (200):**

```json
[{ "id": 1, "fullName": "Ahmad S.Pd" }]
```

---

### GET `/routes/api/class-subjects/unassigned/:classId`

Get subjects not yet assigned to a class.

**Response (200):**

```json
[{ "id": 5, "name": "Bahasa Inggris" }]
```

---

### GET `/routes/api/class-subjects/:id`

Get single class-subject assignment.

**Response (200):**

```json
{
  "success": true,
  "data": { "...class-subject object" }
}
```

---

### POST `/routes/api/class-subjects`

Create class-subject assignment.

**Request Body:**

```json
{
	"classId": 1,
	"subjectId": 3,
	"teacherId": 2
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Penugasan mapel berhasil dibuat",
  "data": { "...created assignment" }
}
```

---

### PUT `/routes/api/class-subjects/:id`

Update assignment (change teacher).

**Request Body:**

```json
{
	"teacherId": 5
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Penugasan mapel berhasil diperbarui",
  "data": { "...updated assignment" }
}
```

---

### DELETE `/routes/api/class-subjects/:id`

Remove class-subject assignment.

**Response (200):**

```json
{
	"success": true,
	"message": "Penugasan mapel berhasil dihapus"
}
```

---

## 11. Rombel (Class Group)

**Base Path:** `/routes/api/rombel`

### GET `/routes/api/rombel`

Get all rombel (class groups).

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"className": "X A",
			"classId": 1,
			"academicYearId": 1,
			"studentCount": 28,
			"homeTeacherId": 2,
			"createdAt": "ISO datetime"
		}
	]
}
```

---

### GET `/routes/api/rombel/:id`

Get rombel detail with students.

**Response (200):**

```json
{
	"success": true,
	"data": {
		"id": 1,
		"className": "X A",
		"classId": 1,
		"academicYearId": 1,
		"students": [
			{
				"id": 1,
				"studentName": "string",
				"nisn": 1234567890,
				"status": "ACTIVE"
			}
		],
		"studentCount": 28
	}
}
```

---

### POST `/routes/api/rombel`

Create new rombel(s). **Accepts an array.**

**Request Body:**

```json
[
	{
		"className": "X A (required)",
		"classId": 1,
		"academicYearId": 1,
		"homeTeacherId": 2,
		"capacity": 30
	}
]
```

**Response (201):**

```json
{
	"success": true,
	"message": "Rombel(s) created successfully"
}
```

---

### DELETE `/routes/api/rombel/:id`

Delete rombel.

**Response (200):**

```json
{
	"success": true,
	"message": "Rombel deleted successfully"
}
```

---

## 12. Scores

**Base Path:** `/routes/api/score`

### GET `/routes/api/score/class-subjects`

Get all class-subject combinations with their assessment types.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"classSubjectId": 1,
			"className": "Kelas 1",
			"subjectName": "Matematika",
			"assessmentTypes": [{ "id": 1, "name": "Ulangan Harian 1", "code": "UH1" }]
		}
	]
}
```

---

### GET `/routes/api/score/scorebyclass`

Get scores for a class-subject combination.

| Query Param      | Type   | Required |
| ---------------- | ------ | -------- |
| `classSubjectId` | number | yes      |

**Response (200):**

```json
{
	"success": true,
	"className": "Kelas 1",
	"subjectName": "Matematika",
	"assessmentTypes": [{ "id": 1, "name": "Ulangan Harian 1", "code": "UH1" }],
	"data": [
		{
			"studentId": 1,
			"studentName": "string",
			"nisn": 1234567890,
			"scores": {
				"1": 85,
				"2": 90
			}
		}
	]
}
```

---

### GET `/routes/api/score/subjects/:rombelId`

Get subjects available for a rombel.

**Response (200):**

```json
{
	"success": true,
	"data": [{ "id": 1, "name": "Matematika", "code": "MTK" }]
}
```

---

### GET `/routes/api/score/template/:rombelId`

Download Excel score template pre-populated with students.

| Query Param | Type   | Required                         |
| ----------- | ------ | -------------------------------- |
| `subjectId` | number | no (filter for specific subject) |

**Response:** Excel file (.xlsx).

---

### POST `/routes/api/score/scores`

Save student scores.

**Request Body:**

```json
{
	"classSubjectId": 1,
	"assessmentTypeId": 1,
	"scores": [
		{
			"studentId": 1,
			"score": 85,
			"note": "string (optional)"
		},
		{
			"studentId": 2,
			"score": 90,
			"note": ""
		}
	]
}
```

**Response (200):**

```json
{
	"success": true,
	"message": "Scores saved successfully",
	"saved": 2
}
```

---

### POST `/routes/api/score/upload`

Upload scores from Excel. **Content-Type:** `multipart/form-data`

| Field  | Type | Constraint  |
| ------ | ---- | ----------- |
| `file` | file | Excel .xlsx |

**Response (200):**

```json
{
	"success": true,
	"message": "Scores uploaded successfully",
	"saved": 25,
	"errors": []
}
```

---

### POST `/routes/api/score/upload-bulk`

Bulk upload scores in pivot table format. **Content-Type:** `multipart/form-data`

| Field  | Type | Constraint                 |
| ------ | ---- | -------------------------- |
| `file` | file | Excel .xlsx (pivot layout) |

**Response (200):**

```json
{
	"success": true,
	"message": "Bulk scores uploaded successfully",
	"saved": 50
}
```

---

### GET `/routes/api/score/student/:studentId/summary`

Get score summary for a student.

**Response (200):**

```json
{
	"studentId": 1,
	"studentName": "string",
	"scores": [
		{
			"subjectId": 1,
			"subjectName": "Matematika",
			"assessmentType": "Ulangan Harian 1",
			"score": 85,
			"assessmentDate": "ISO datetime"
		}
	]
}
```

---

### GET `/routes/api/score/rombel/:rombelId/report`

Get complete score report for a rombel.

**Response (200):**

```json
{
	"rombelId": 1,
	"className": "X A",
	"students": [
		{
			"studentId": 1,
			"studentName": "string",
			"subjects": [
				{
					"subjectId": 1,
					"subjectName": "Matematika",
					"scores": [{ "assessmentType": "UH1", "score": 85 }],
					"average": 87.5
				}
			],
			"overallAverage": 85.3
		}
	]
}
```

---

## 13. Promotion

**Base Path:** `/routes/api/promotion`

### GET `/routes/api/promotion/rombels`

Get rombels available for student promotion.

| Query Param      | Type   | Required |
| ---------------- | ------ | -------- |
| `academicYearId` | number | no       |

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"classId": 1,
			"className": "Kelas 1",
			"isFinalGrade": false,
			"rombels": [{ "id": 1, "className": "X A", "studentCount": 28 }]
		}
	]
}
```

---

### GET `/routes/api/promotion/academic-years`

Get academic years for promotion filter.

**Response (200):**

```json
{
	"success": true,
	"data": [{ "id": 1, "name": "2024/2025" }]
}
```

---

### GET `/routes/api/promotion/class-levels`

Get class levels for promotion target.

**Response (200):**

```json
{
	"success": true,
	"data": [{ "id": 1, "className": "Kelas 1", "classLevel": 1 }]
}
```

---

### GET `/routes/api/promotion/students/:rombelId`

Get active students from a rombel ready for promotion.

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"studentName": "string",
			"nisn": 1234567890,
			"currentRombelId": 1
		}
	],
	"count": 28
}
```

---

### GET `/routes/api/promotion/targets/:classId`

Get target rombels for promotion (next class level).

**Response (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": 5,
			"className": "XI A",
			"currentCount": 15,
			"capacity": 30
		}
	]
}
```

---

### POST `/routes/api/promotion/promote`

Promote students to a new rombel.

**Request Body:**

```json
{
	"studentIds": [1, 2, 3],
	"targetRombelId": 5,
	"sourceRombelId": 1,
	"promotionDate": "2025-07-01",
	"notes": "string (optional)"
}
```

**Response (200):**

```json
{
	"success": true,
	"message": "Students promoted successfully",
	"promoted": 3
}
```

---

## 14. Graduate / Alumni

**Base Path:** `/routes/api/graduates`

### GET `/routes/api/graduates`

Get all graduated students with pagination.

| Query Param | Type   | Default                       |
| ----------- | ------ | ----------------------------- |
| `page`      | number | 1                             |
| `limit`     | number | 10                            |
| `year`      | number | - (filter by graduation year) |

**Response (200):**

```json
{
	"data": [
		{
			"studentId": 1,
			"studentName": "string",
			"nisn": 1234567890,
			"graduationYear": 2025,
			"completionDate": "2025-06-15",
			"certificateNumber": "string",
			"finalGrade": 87.5,
			"status": "GRADUATE"
		}
	],
	"pagination": {
		"total": 50,
		"page": 1,
		"limit": 10,
		"totalPages": 5
	}
}
```

---

### GET `/routes/api/graduates/stats`

Graduation statistics.

**Response (200):**

```json
{
	"total": 150,
	"byYear": {
		"2023": 45,
		"2024": 52,
		"2025": 53
	},
	"years": [2023, 2024, 2025]
}
```

---

### GET `/routes/api/graduates/years`

Get distinct graduation years for filter dropdown.

**Response (200):**

```json
[2023, 2024, 2025]
```

---

### GET `/routes/api/graduates/:id`

Get single graduate/alumni detail.

**Response (200):**

```json
{
	"studentId": 1,
	"studentName": "string",
	"nisn": 1234567890,
	"graduationYear": 2025,
	"completionDate": "2025-06-15",
	"certificateNumber": "string",
	"finalGrade": 87.5,
	"scores": [{ "subjectName": "Matematika", "score": 90 }]
}
```

---

### POST `/routes/api/graduates/:id`

Graduate a student (change status to GRADUATE).

**Request Body:**

```json
{
	"completionDate": "2025-06-15 (required)",
	"graduationYear": 2025,
	"certificateNumber": "string (optional)",
	"finalGrade": 87.5,
	"scores": [{ "subjectId": 1, "score": 90 }]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Student graduated successfully",
  "data": { "...graduate object" }
}
```

---

### POST `/routes/api/graduates/bulk`

Graduate multiple students at once.

**Request Body:**

```json
{
	"students": [1, 2, 3],
	"commonData": {
		"completionDate": "2025-06-15",
		"graduationYear": 2025,
		"certificateNumber": "string (optional)"
	}
}
```

**Response (200):**

```json
{
	"success": true,
	"message": "Students graduated successfully",
	"graduated": 3
}
```

---

### PUT `/routes/api/graduates/:id`

Update alumni data.

**Request Body:** Same as POST (partial updates allowed).

**Response (200):**

```json
{
  "success": true,
  "message": "Alumni data updated successfully",
  "data": { "...updated graduate object" }
}
```

---

## 15. Audit Logs

**Base Path:** `/routes/api/audit-logs`

### GET `/routes/api/audit-logs`

Get audit logs with optional filters.

| Query Param | Type   | Description                                          |
| ----------- | ------ | ---------------------------------------------------- |
| `type`      | string | Filter by audit_type (CREATE, UPDATE, DELETE, LOGIN) |
| `user`      | string | Filter by user_id                                    |
| `status`    | string | Filter by status (SUCCESS, FAILED)                   |
| `search`    | string | Search in action, target, user_id                    |
| `timeRange` | string | all, today, week, month, semester                    |

**Response (200):**

```json
[
	{
		"id": 1,
		"user_id": "admin",
		"audit_type": "CREATE",
		"action": "Created new student",
		"target": "student",
		"targetId": 15,
		"status": "SUCCESS",
		"details": "{\"studentName\": \"...\"}",
		"timestamp": "ISO datetime"
	}
]
```

---

### GET `/routes/api/audit-logs/:id`

Get single audit log.

**Response (200):**

```json
{
	"id": 1,
	"user_id": "admin",
	"audit_type": "CREATE",
	"action": "Created new student",
	"target": "student",
	"targetId": 15,
	"status": "SUCCESS",
	"details": "{...}",
	"timestamp": "ISO datetime"
}
```

---

## Error Responses

All endpoints follow consistent error shapes:

**400 Bad Request:**

```json
{ "success": false, "message": "Error description" }
```

**401 Unauthorized:**

```json
{ "success": false, "message": "Unauthorized" }
```

**404 Not Found:**

```json
{ "success": false, "message": "Resource not found" }
```

**500 Internal Server Error:**

```json
{ "success": false, "message": "Internal server error", "error": "details (dev only)" }
```

---

## Middleware & Security

| Middleware                | Purpose                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `VERIFY_TOKEN_MIDDLEWARE` | JWT authentication for protected endpoints                       |
| `auditLog`                | Automatically logs all API requests                              |
| `GLOBAL_RATE_LIMIT`       | Rate limiting to prevent abuse                                   |
| `CORS`                    | Configured with `credentials: true`, `optionsSuccessStatus: 200` |

---

## Database Schema (SQLite + Drizzle ORM)

| Entity           | Table             | Key Fields                                                                               |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| Users            | `users`           | id, username, password (bcrypt), role, email                                             |
| Students         | `student`         | id, studentName, nisn, localNis, gender, status + related Father/Mother/Guardian/Address |
| Teachers         | `teachers`        | id, userId, nip, fullName, gender, birthPlace, birthDate                                 |
| Academic Years   | `academic_year`   | id, name, startYear, endYear, isActive                                                   |
| Classes          | `classes`         | id, className, classLevel, isFinalGrade, academicYearId, curriculumId                    |
| Rombels          | `classGroup`      | id, className, classId, academicYearId, homeTeacherId                                    |
| Subjects         | `subjects`        | id, name, subjectCode, description, kkm                                                  |
| Class-Subject    | `class_subject`   | id, classId, subjectId, teacherId                                                        |
| Scores           | `student_scores`  | id, studentId, classSubjectId, assessmentTypeId, score                                   |
| Assessment Types | `assessment_type` | id, name, code, description, isActive, weight                                            |
| Curriculum       | `curriculum`      | id, name, code, year, description, isActive                                              |
| Audit Logs       | `audit`           | id, user_id, audit_type, action, target, status, timestamp                               |
