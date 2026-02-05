# Refactoring Documentation: School Controller & Service

This document outlines the refactoring of the `schoolController.js` file, separating concerns by moving business logic and data access into a dedicated service layer (`schoolData.service.js`).

## Overview

The goal of this refactoring was to adhere to the **Separation of Concerns** principle.
- **Controllers** should handle HTTP requests, input validation, and sending responses.
- **Services** should handle business logic, database queries, and file system operations.

## Changes Made

### 1. Created `backend/services/schoolData.service.js`

This new file encapsulates all logic related to school data management.

**Key Functions:**

*   **`findLogoFile()`**:
    *   Scans the `public/upload/profilesch` directory for image files.
    *   Returns the path to the first found image or an empty string.
    *   *Logic moved from controller.*

*   **`getFacilitiesData()`**:
    *   Orchestrates the retrieval of facility images.
    *   Calls the internal helper `findFacilityImages` (which scans `public/upload/imageSch`) to build a structured object of facility image paths.
    *   *Logic moved from controller.*

*   **`getSchoolDataFromDB()`**:
    *   Executes a Drizzle ORM query to fetch the single school record.
    *   `db.select().from(schoolTable).limit(1)`

*   **`updateSchoolDataInDB(id, data)`**:
    *   Updates the school record in the database.
    *   Automatically calls `findLogoFile()` to ensure the logo URL is current.
    *   Returns the updated record.

*   **`createSchoolDataInDB(data)`**:
    *   Inserts a new school record into the database.
    *   Automatically calls `findLogoFile()`.
    *   Returns the created record.

### 2. Updated `backend/controllers/schoolController.js`

The controller is now significantly lighter and focuses on the request/response cycle.

**Refactored Methods:**

*   **`getFacilityImages`**:
    *   Calls `service.getFacilitiesData()`.
    *   Returns the result as JSON.

*   **`getSchoolData`**:
    *   Calls `service.getSchoolDataFromDB()`.
    *   If found, it merges the DB data with the results from `service.findLogoFile()` and `service.getFacilitiesData()`.
    *   Sends the final JSON response.

*   **`updateSchoolData`**:
    *   Extracts data from `req.body`.
    *   Checks for existence using `service.getSchoolDataFromDB()`.
    *   Calls `service.updateSchoolDataInDB()` to perform the update.
    *   Sends the success response.

*   **`createSchoolData`**:
    *   Extracts data from `req.body`.
    *   Checks if data already exists using `service.getSchoolDataFromDB()`.
    *   Calls `service.createSchoolDataInDB()` to insert.
    *   Sends the success response.

## Benefits

1.  **Testability**: The service functions can now be unit tested independently of the HTTP layer (Express).
2.  **Reusability**: The service functions can be reused by other parts of the application (e.g., a CLI script or another controller) without duplicating logic.
3.  **Maintainability**: The code is cleaner and easier to read. The controller tells you *what* is happening, and the service tells you *how* it is happening.
