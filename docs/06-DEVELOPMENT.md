# Development Guide

## Quick Start

```bash
# Frontend (root folder)
npm run dev

# Backend
cd backend && npm run dev

# Both (from root)
npm run start
```

## Project Structure

```
siakad-madrasah/
├── src/                  # Frontend (SvelteKit)
│   ├── routes/           # Pages
│   └── lib/              # Components, utils
├── backend/
│   ├── app.js            # Express entry
│   ├── routes/           # API routes
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic
│   └── src/db/schema/    # Drizzle schemas
└── docs/                 # Documentation
```

## Database Commands

```bash
cd backend

# Development - push schema changes
npx drizzle-kit push

# Production - generate migration
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Visual DB browser
npx drizzle-kit studio
```

## Building Electron App

```bash
cd backend

# Test locally
npm run electron:dev

# Build installer
npm run electron:build:win
```

Output: `backend/dist-electron/`

---

## Known Issues

### Student Profile - Missing Class Name
**Problem:** Class name not showing on student detail page.
**Solution:** Need JOIN with rombel → classes tables.

### Parent Data
**Current:** Embedded in student-related tables.
**Future:** May need dedicated parent table for shared parent data.

---

## Roadmap

### Phase 1: Core Features ✅
- [x] Student CRUD
- [x] Teacher management
- [x] Class management
- [x] Rombel system
- [x] Scoring system

### Phase 2: Enhancement
- [ ] Report generation (PDF)
- [ ] Score weighting
- [ ] Attendance tracking
- [ ] Dashboard analytics

### Phase 3: Integration
- [ ] Prisma ORM migration
- [ ] MySQL/PostgreSQL support
- [ ] Multi-school support

---

## Code Style

### Backend
- Services contain business logic
- Controllers handle HTTP only
- Use transactions for multi-table operations
- Return consistent response format

### Frontend
- Components are self-contained
- Use Tailwind for styling
- Svelte stores for shared state
- Debounce search inputs (300ms)

---

## Testing

```bash
cd backend

# Run tests
npm test

# API testing (using .http files)
# Use REST Client extension in VS Code
```
