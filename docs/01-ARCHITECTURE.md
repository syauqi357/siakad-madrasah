# System Architecture

## Overview

SIAKAD Madrasah uses a 3-layer architecture:

```
Frontend (SvelteKit) → Backend (Express.js) → Database (SQLite/Drizzle)
```

## Backend Pattern

**Layered Structure:**
```
Routes → Controllers → Services → Database
```

| Layer | Purpose | Example |
|-------|---------|---------|
| Routes | Define endpoints | `POST /auth/login` |
| Controllers | Handle HTTP request/response | Validate input, send response |
| Services | Business logic | Query DB, process data |

**Example Flow (Login):**
```
POST /auth/login
  → authController.login()
    → authService.authenticate()
      → db.query()
```

## Frontend Patterns

### Component Encapsulation
Input components bundle styling + logic together (e.g., `PhoneInput.svelte`):
- Material Design floating labels
- Tailwind `peer` selectors for focus states
- Consistent validation across app

### Numbers-Only Input
Use `type="text"` with regex filter (not `type="number"`):
```javascript
on:input={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
```
This preserves leading zeros (important for phone numbers, NIS).

### Hardcoded Demo Data
Landing pages use hardcoded demo data for:
- Instant render (no loading state)
- Fallback if API fails
- TypeScript initialization

Dashboard pages use real data with proper empty states.

## API Design Decisions

### Why POST for Bulk Score Updates (not PUT/PATCH)

| Method | Use Case |
|--------|----------|
| PUT | Replace entire single resource |
| PATCH | Partial update single resource |
| POST | Create new OR bulk operations |

Bulk score saving uses POST because:
1. It's a bulk operation (multiple records)
2. It's an upsert (INSERT or UPDATE)
3. URL represents a collection, not single resource
