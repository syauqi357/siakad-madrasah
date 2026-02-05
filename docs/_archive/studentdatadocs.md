# Student Data Input Mechanism

This document outlines the end-to-end data flow for creating a new student, from the frontend form to the backend database transaction. This architecture is designed to ensure data integrity and a clean separation of concerns.

## 1. Frontend: Data Collection (`addStudent/+page.svelte`)

The process begins at the "Add Student" form.

- **State Management:** A single, comprehensive `formData` object is maintained in the component's state. This object contains nested objects for related data, such as `address`, `father`, and `mother`.

- **Payload Structure:** When the user clicks "Save", this `formData` object is serialized into a single JSON payload. This "One Big Payload" approach is intentional.

  ```json
  {
    "studentName": "Ahmad Test",
    "nisn": "123456",
    "address": {
      "street": "Jl. Merdeka No. 10",
      "province": "Jawa Timur"
    },
    "father": {
      "name": "Budi Santoso",
      "nik": "3500000000000002"
    },
    "mother": { ... }
  }
  ```

## 2. API Layer: The Hand-off

- **Controller (`studentController.js`):** The frontend sends the JSON payload via a `POST` request to an endpoint like `/api/students`. The controller's role is minimal: it receives the `req.body` (the payload) and immediately passes it to the service layer. It does not contain any business logic.

  ```javascript
  // studentController.js
  export const createStudent = async (req, res) => {
      const newStudent = await studentService.createStudentData(req.body);
      res.status(201).json(newStudent);
  };
  ```

## 3. Backend: The Transactional Service (`student.service.js`)

This is the core of the mechanism, where the data is safely processed and saved.

- **Function:** `createStudentData(payload)`

- **Mechanism: Database Transaction**
  The entire operation is wrapped in a `db.transaction(async (tx) => { ... })`. This guarantees **atomicity**: either all database insertions succeed, or they all fail and are rolled back, preventing orphaned data.

### Transaction Steps:

1.  **Extract Data:** The service first separates the incoming `payload` into distinct objects that match the database schemas (`studentData`, `addressData`, `fatherData`, etc.).

2.  **Insert Primary Record (Student):**
    - The `studentData` is inserted into the `studentTable`.
    - Crucially, we use `.returning()` to immediately get the `id` of the newly created student.

    ```javascript
    const [newStudent] = await tx.insert(studentTable).values(studentData).returning();
    const studentId = newStudent.id;
    ```

3.  **Insert Secondary Records (Address, Parents):**
    - The `studentId` obtained in the previous step is now used as the foreign key for all related data.
    - The service checks if `payload.address` exists. If so, it inserts the address data into the `studentAddress` table, along with the `studentId`.
    - The same process is repeated for `studentFather`, `studentMother`, and `studentWali`.

    ```javascript
    if (payload.address) {
        await tx.insert(studentAddress).values({
            studentId: studentId, // Using the new ID
            ...payload.address
        });
    }
    ```

4.  **Commit or Rollback:**
    - If all `insert` operations within the transaction block complete without error, the transaction is **committed**, and all data is permanently saved.
    - If any single operation fails (e.g., a database constraint violation, a network error), the transaction automatically **rolls back**, erasing any data that was inserted during the process (including the initial student record).

This transactional approach ensures that the database always remains in a consistent and valid state.
