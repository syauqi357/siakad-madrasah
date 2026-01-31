# Student Filter Service Documentation

> **Date:** January 19, 2026
> **Feature:** Filter Assigned Students in "Add Rombel" Page

---

## 🎯 Objective

To prevent students from being assigned to multiple class groups (Rombel) simultaneously. The system should filter out students who are already linked to a rombel when fetching the student list for creating a new rombel.

---

## 🛠️ Implementation Details

### Service Function: `findAllStudentsLite`

**Location:** `backend/services/student.service.js`

This function is used by the frontend to populate the "Available Students" list in the Add Rombel form.

### The Algorithm

We use a **Left Join Exclusion** pattern (SQL's `LEFT JOIN ... WHERE ... IS NULL`) to find students who do **not** have a matching record in the `rombel_students` table.

### Code Implementation (Drizzle ORM)

```javascript
export const findAllStudentsLite = async () => {
	// Filter out students who are already in a rombel (rombelStudents table)
	return (
		db
			.select({
				id: studentTable.id,
				name: studentTable.studentName,
				nisn: studentTable.nisn
			})
			.from(studentTable)
			// 1. Join student table with rombel_students junction table
			.leftJoin(rombelStudents, eq(studentTable.id, rombelStudents.studentId))
			// 2. Filter: Only keep rows where the join failed (meaning no rombel assignment exists)
			.where(isNull(rombelStudents.studentId))
	);
};
```

### SQL Equivalence

This Drizzle query translates effectively to the following SQL:

```sql
SELECT s.id, s.student_name, s.nisn
FROM student s
LEFT JOIN rombel_students rs ON s.id = rs.student_id
WHERE rs.student_id IS NULL;
```

---

## 📊 Result

- **Before:** The API returned ALL students, regardless of their status.
- **After:** The API returns ONLY students who are "free" (not assigned to any rombel).
- **Frontend Impact:** The `src/routes/(app)/rombel/addrombel/+page.svelte` automatically reflects this filtered list without needing frontend logic changes.
