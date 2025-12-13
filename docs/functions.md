# Backend Functions Documentation

## 🔐 Authentication Services
**File**: `backend/services/authService.js`

### `getAccounts()`
- **Description**: Reads and parses teacher accounts from `guru.json`
- **Parameters**: None
- **Returns**: `Array` - List of account objects or empty array on error
- **Usage**: Internal helper for authentication

### `authenticateUser(username, password)`
- **Description**: Validates user credentials and generates JWT token
- **Parameters**:
  - `username` (string) - User's username
  - `password` (string) - User's password
- **Returns**: `Object`
  - Success: `{ success: true, message: "Login successful", token, user }`
  - Failure: `{ success: false, message: "Error message" }`
- **Logic**:
  1. Validates input (username & password required)
  2. Reads accounts from guru.json
  3. Finds matching user
  4. Generates JWT token (24h expiry)
  5. Returns user data without password

### `verifyTokenService(token)`
- **Description**: Verifies JWT token validity
- **Parameters**:
  - `token` (string) - JWT token to verify
- **Returns**: `Object`
  - Success: `{ success: true, decoded: {...} }`
  - Failure: `{ success: false, message: "Error message" }`

---

## 🎮 Auth Controller
**File**: `backend/controllers/authController.js`

### `login(req, res)`
- **Route**: `POST /api/auth/login`
- **Description**: HTTP handler for user login
- **Request Body**: `{ username, password }`
- **Response**: 200/400/401/500 with JSON
- **Flow**:
  1. Extracts username & password from request
  2. Calls `authenticateUser()` service
  3. Returns appropriate HTTP response
- **Status Codes**:
  - 200: Login successful
  - 400: Missing credentials
  - 401: Invalid credentials
  - 500: Server error

### `logout(req, res)`
- **Route**: `POST /api/auth/logout`
- **Description**: HTTP handler for user logout
- **Response**: 200 with success message
- **Note**: JWT logout handled client-side by removing token

### `verifyToken(req, res, next)`
- **Type**: Express Middleware
- **Description**: Validates JWT token on protected routes
- **Location**: Authorization header (`Bearer <token>`)
- **Flow**:
  1. Extracts token from `Authorization` header
  2. Calls `verifyTokenService()`
  3. Attaches decoded user to `req.user`
  4. Calls `next()` or returns 401 error
- **Usage**: Add to protected routes: `router.get('/protected', verifyToken, controller)`

---

## 🏫 School Controller
**File**: `backend/controllers/schoolController.js`

### `getSchoolData(req, res)`
- **Route**: `GET /api/schoolData`
- **Description**: Fetches school information and logo
- **Response**: 200 with school data + logo URL
- **Data Source**: `backend/data/lembaga.json`
- **Logo**: Auto-finds logo file from `backend/public/upload/profilesch/`
- **Supported Image Types**: `.svg, .png, .jpg, .jpeg, .gif, .webp`

### `updateSchoolData(req, res)`
- **Route**: `PUT /api/schoolData`
- **Status**: ⚠️ **NOT IMPLEMENTED**
- **Description**: Placeholder for future school data update (requires database)
- **Response**: 501 (Not Implemented)

---

## 👨‍🎓 Student Data Controller
**File**: `backend/controllers/studentDatacontroller.js`

### `getAllStudents(req, res)`
- **Route**: `GET /api/studentData`
- **Description**: Retrieves all students
- **Response**: 200 with array of student objects
- **Data Source**: `backend/data/student.json`

### `getStudentById(req, res)`
- **Route**: `GET /api/studentData/:id`
- **Description**: Retrieves specific student by ID
- **Parameters**: `id` (URL param - integer)
- **Response**:
  - 200: Student object
  - 404: Student not found
- **Data Source**: `backend/data/student.json`

---

## 🛣️ Routes Overview

### Auth Routes (`api/auth`)
```
POST   /api/auth/login     → authController.login()
POST   /api/auth/logout    → authController.logout()
```

### School Data Routes (`api/schoolData`)
```
GET    /api/schoolData     → schoolController.getSchoolData()
PUT    /api/schoolData     → schoolController.updateSchoolData() [NOT IMPLEMENTED]
```

### Student Routes (`api/studentData`)
```
GET    /api/studentData      → getAllStudents()
GET    /api/studentData/:id  → getStudentById()
```

---

## 📊 Architecture Summary

| Layer | Files | Purpose |
|-------|-------|---------|
| **Service** | `authService.js` | Business logic (auth, JWT) |
| **Controller** | 3 files | HTTP request/response handling |
| **Route** | 3 files | Route definitions & mounting |

**Total Functions**: 8 (6 implemented, 1 not implemented, 1 middleware)

---

## 🔄 Data Flow Example: Login

```
Client (POST /api/auth/login with credentials)
  ↓
authController.login()
  ↓
authService.authenticateUser()
  ├─ getAccounts() → read guru.json
  ├─ Find user match
  ├─ Generate JWT token
  └─ Return result
  ↓
authController returns HTTP response (200/401/400/500)
  ↓
Client receives { success, token, user }
```

---

## 🚀 Migration Notes

**Current State**: All data from JSON files (guru.json, student.json, lembaga.json)

**To migrate to SQLite/Drizzle**:
1. Update `authService.js` to query database instead of reading JSON
2. Update other controllers similarly
3. Routes & controllers stay mostly the same (MVC separation maintained)
