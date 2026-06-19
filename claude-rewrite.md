# SIAKAD Madrasah — Backend Rewrite Plan (Node/Express → Go/Fiber)

> Status: planning. New work lives in a **separate repo** (`siakad-go`). This repo stays the working, defendable build.

---

## 1. Goal

Rewrite the Express.js backend in **Go + Fiber**, keeping the **exact same HTTP API contract** so the SvelteKit frontend never changes. Along the way, fix the known weakness: **authentication-without-authorization** ("potato RBAC") → real, enforced multi-level RBAC.

This is **not** a feature change. Same endpoints, same JSON, same status codes. Different engine underneath.

---

## 2. The one decision that gates everything: deployment topology

The DB choice depends entirely on **how the app is deployed**:

| Topology | Meaning | DB | Driver |
|----------|---------|----|----|
| **Local desktop (default)** | One madrasah, Electron app, admin + teachers take turns on one machine, offline | **SQLite** | `modernc.org/sqlite` (pure Go, no CGO) |
| **Networked / multi-device** | Teachers log in from their own laptops/phones to one shared server, concurrent use | **PostgreSQL** | `pgx` |

**Recommendation: stay SQLite unless going networked.** SQLite is *why* the thesis offline/low-cost/data-locality angle works — it's embedded, zero-config, ships inside the app. Postgres needs a running server process the madrasah must install and babysit, which contradicts that argument. Postgres only earns its keep with real concurrent multi-device usage.

> **ACTION: confirm topology before DB code is written.** Everything below assumes SQLite; swapping to Postgres changes only the DB layer + sqlc dialect, not the structure.

---

## 3. Stack mapping

| Concern | Express (now) | Go/Fiber (target) |
|---------|---------------|-------------------|
| HTTP framework | Express 5 | `github.com/gofiber/fiber/v2` |
| DB access | Drizzle ORM | **sqlc** (typed codegen from SQL) |
| DB | SQLite (better-sqlite3) | SQLite (`modernc.org/sqlite`) *or* Postgres (`pgx`) |
| Migrations | drizzle-kit | `goose` or `golang-migrate` (reuse `0000_init.sql`) |
| JWT | jsonwebtoken | `golang-jwt/jwt/v5` |
| JWT middleware | hand-rolled `verifyToken.js` | `gofiber/contrib/jwt` + custom role guard |
| Password hash | bcryptjs | `golang.org/x/crypto/bcrypt` |
| Excel | ExcelJS | `github.com/xuri/excelize/v2` |
| Rate limit | express-rate-limit / slow-down | `fiber/middleware/limiter` (built in) |
| CORS / logger / recover | manual middleware | Fiber built-in middleware |
| File upload | multer | Fiber `c.FormFile` (built in) |

DB layer is independent of Fiber — sqlc works regardless of HTTP framework.

---

## 4. Project structure (proposed)

```
siakad-go/
├─ cmd/
│  └─ server/
│     └─ main.go            # entry: load env, open db, mount routes, listen :3112
├─ internal/
│  ├─ config/               # env, constants (PORT, JWT secret, db url)
│  ├─ db/
│  │  ├─ migrations/        # 0000_init.sql (copied from drizzle)
│  │  ├─ queries/           # *.sql files → sqlc input
│  │  └─ sqlc/              # generated typed code (do not edit)
│  ├─ middleware/
│  │  ├─ auth.go            # RequireAuth (validate JWT → ctx)
│  │  ├─ rbac.go            # RequireRole("admin")
│  │  └─ ratelimit.go
│  ├─ handlers/             # one file per domain (auth, student, score, …)
│  ├─ services/             # business logic (mirror current services/)
│  └─ models/               # request/response DTOs matching current JSON
├─ sqlc.yaml
├─ go.mod
└─ .env
```

Mirrors the current `controllers → services → db` separation so the mental map carries over.

---

## 5. Migration strategy — Strangler Fig

Keep both backends runnable during the transition:

1. Stand up the Go server on a **different port** (e.g. `:3113`).
2. Port endpoints one domain at a time. Verify each against the live Express response (same input → same JSON).
3. Once a domain is verified, the frontend points that route at Go.
4. When all domains are ported, flip the frontend base URL to Go on `:3112` and retire Express.

The app stays green at every step. You can stop anytime and still have something that works.

> **Contract source of truth:** `API_DOCUMENTATION.md` + `API_JSON_PAYLOAD.md` in this repo. Both backends must satisfy them.

---

## 6. RBAC design (the real fix)

Current state: `users.role` exists (`admin` | `teacher`) but **nothing enforces it** — any valid token passes every gate. Two layers fix it:

**Layer 1 — `RequireAuth`** (every protected route)
- Validate JWT, extract `{ userId, role }`, put in `c.Locals`.

**Layer 2 — `RequireRole("admin")`** (admin-only routes)
- Chains after `RequireAuth`. 403 if role ≠ admin.
- Applies to: add/edit/delete teacher, subject assignment, bulk student upload, school data edit, academic year, curriculum, promotion/graduate ops.

**Layer 3 — row-level scope for teachers** (the meaty part)
- A teacher may only read/write `class_subject` rows assigned to them, and only score students within those.
- Enforced in the **service/query layer**, not just middleware: scope queries by `teacher_id` from the token.

This three-layer model is the defensible thesis upgrade: *"v1 authenticated; v2 authorizes — role gate + row-level scoping."*

---

## 7. Port order (phased)

Each phase = vertical slice: queries → service → handler → verified against Express.

**Phase 0 — Scaffold**
- `go mod`, Fiber boot, `:3112` listen, health check `GET /`, env loading, db open, sqlc wired, `0000_init.sql` migration runs.

**Phase 1 — Auth + RBAC (do first — proves the whole stack)**
- `POST /login` → bcrypt verify + JWT sign.
- `RequireAuth` + `RequireRole` middleware.
- A protected `GET /me` to confirm token + role flow end-to-end.

**Phase 2 — School data** (read-heavy, simple — easy second win)
- `GET/PUT school_data`, facilities, buildings.

**Phase 3 — Students** (the big one)
- CRUD, list/filter, count, detail with nested address/father/mother.
- **Bulk Excel upload** — port `createBulkStudentsFromExcel` with the `normalizeCellValue` fix already learned (flatten richText/hyperlink/formula cells → primitives). Use `excelize`.

**Phase 4 — Academic structure**
- Academic year, curriculum, classes, rombel (+ rombel students), subjects, subject assignment (admin-gated).

**Phase 5 — Scores**
- Score CRUD per class/subject, assessment types, exam management. Teacher row-level scope applies here.

**Phase 6 — Lifecycle**
- Promotion (upgrade), graduate (+ bulk), mutasi, alumni, dropout.

**Phase 7 — Cross-cutting**
- Audit logging middleware, rate limiting, CORS, error envelope matching current `{ success, message }` shape.

---

## 8. Things that must NOT change

- **Route paths + JSON shapes** — frontend depends on them verbatim.
- **Error envelope** — current responses use `{ success: bool, message: string }`. Match exactly.
- **SQLite schema** — reuse `0000_init.sql` as-is. No data migration; point Go at the same schema (and optionally the same `siakad.db`).
- **Port 3112** (final cutover).

---

## 9. Testing

- Port the spirit of the existing Jest tests (`student.bulk_upload`, `student.payload`, `score.services`, `rombel.services`) to Go `testing` + table-driven tests.
- For the bulk-upload port specifically: add a case for **object-valued cells** (richText/hyperlink/formula) — the exact real-data bug that v1 never handled.
- Golden-file approach for the strangler phase: capture Express JSON responses, assert Go matches.

---

## 10. What I (Claude) need from you to start

1. ✅ Go installed (`go version` works).
2. ✅ New repo created (`siakad-go`, `go mod init siakad-madrasah`).
3. ✅ `0000_init.sql` (and optionally `siakad.db`) copied in.
4. ⬜ **Topology answer** → SQLite (default) or Postgres.
5. ⬜ Point me at the `siakad-go` folder path.

Then I scaffold Phase 0 + write Phase 1 (auth + RBAC) immediately.

---

## 11. Decisions already locked

- Framework: **Fiber** (Express-like ergonomics, fasthttp speed).
- DB access: **sqlc** (typed, codegen, closest to the Drizzle mental model).
- Auth: **golang-jwt/v5 + x/crypto/bcrypt**.
- Migration approach: **strangler fig**, endpoint-by-endpoint, frontend untouched.
- Same API contract, same port, same schema.

> Open only: **topology → DB**. Everything else is ready to build.

---

# akademik-go

## Overview
This repo is a rewrite of an existing Express.js (Node.js) backend into Golang. The app is an academic information and management system (SIAKAD) for a madrasah (MTs Al-Hasyimiy). This is **not a 1:1 translation** — paradigms differ (compiled/typed vs dynamic, explicit error handling, no try/catch). Treat this as a fresh backend implementation that preserves the original data model and business logic, not a port.

Frontend is a **separate repo**, built in Svelte 5 + shadcn-svelte, consuming this backend via REST API. This repo's job is backend only — do not generate frontend code here.

## Dependencies and Versions
- Go — go1.26.4 windows/amd64
- Web framework — github.com/gofiber/fiber/v3
- ORM / DB layer — **sqlc** (not GORM). Write raw `.sql` queries, generate type-safe Go code from them. Do not introduce a query-builder/ORM abstraction on top of this.
- Auth — github.com/golang-jwt/jwt (JWT), golang.org/x/crypto/bcrypt (password hashing)
- Database — SQLite (carried over from the original app; confirm before changing)

## Architecture — Layered Pattern
Strict separation, one direction of dependency only:

```
handler → service → repository
```

- **Handler**: Fiber route handlers only. Parse request, call service, format response. No business logic, no direct DB/SQL calls here.
- **Service**: All business logic lives here. Orchestrates one or more repository calls. This is where authorization checks specific to data relationships (see below) belong.
- **Repository**: Only place that talks to the database (via sqlc-generated code). No business logic here — just data access.

Do not let handlers call repositories directly. Do not put SQL queries outside the repository layer.

## Authorization Model (important — this is not simple RBAC)
This system has **two layers** of access control. Do not collapse them into one:

1. **Role-based (RBAC)** — Admin / Guru / Siswa. Determines *which features/endpoints* a role can access at all (e.g. guru can access "input nilai" endpoints, siswa cannot).
2. **Relationship-based (data-level)** — A guru can only act on data they are actually assigned to. A guru's access to a specific mapel/kelas/siswa is governed by an assignment table (e.g. `guru_mengajar`: guru_id + mapel_id + kelas_id + tahun_ajaran_id), not by their role alone.

**Every service method that mutates or reads guru-scoped academic data (nilai, kelas, mapel) must check both layers**: role check (middleware/handler level) AND relationship check (service level, against the assignment table) before proceeding. Never assume role membership alone is sufficient authorization for academic data operations.

If a new feature has ambiguous scoping rules (e.g. wali kelas permissions, multi-role users), stop and ask rather than assuming a default.

## Auth & Security Requirements (treat as non-negotiable, not suggestions)

- **JWT delivery**: tokens are set via **HTTP-only, Secure, SameSite cookies**. Never expose tokens to JS-accessible storage (no LocalStorage, no returning tokens in JSON response bodies for the frontend to store manually).
- **Password hashing**: bcrypt only, with a deliberately chosen cost factor — do not default to a low cost factor for "performance."
- **JWT contents**: keep claims minimal (user id, role, expiry). Do not embed sensitive data (full name, address, etc.) in the token payload.
- **Token expiry**: short-lived access tokens + refresh token rotation. Do not issue long-lived single tokens.
- **CSRF**: since auth uses cookies, CSRF protection is required (e.g. SameSite=Strict/Lax plus a CSRF token for state-changing requests) — this is not optional just because the cookie is HTTP-only.
- **Input validation**: validate all incoming request bodies/params at the handler boundary before they reach the service layer. Do not trust client input implicitly anywhere downstream.
- **SQL injection**: not applicable in practice since sqlc parameterizes queries by design — but never bypass sqlc with raw string-concatenated queries for "quick" needs.
- **Error responses**: never leak internal error details (stack traces, raw DB errors, query contents) to the client. Log details server-side, return generic safe messages to the client.
- **Rate limiting**: login/auth endpoints specifically must be rate-limited to mitigate brute force.
- **Secrets**: JWT signing secret, DB credentials, etc. via environment variables only. Never hardcoded, never committed.

## Code Style & Naming
- Standard Go conventions: `gofmt`/`goimports` clean, idiomatic error handling (`if err != nil` at each call site, wrapped with context via `fmt.Errorf("...: %w", err)`).
- No single-letter variable names outside trivial loop counters (`i`, `j` in simple loops are fine; everything else gets intent-revealing names).
- No JS-style naming leaking into Go (no camelCase for exported Go identifiers where Go convention differs; follow Go's own casing rules — exported = PascalCase, unexported = camelCase, not JS conventions).
- Package names: short, lowercase, no underscores.

## Reference: Original Data Model
The original Express.js app (Drizzle ORM schema) is the source of truth for the existing data model and relationships. When implementing a table/entity that exists in the old system, check the old Drizzle schema first rather than redesigning it from scratch — unless there's a specific reason to change it (flag and explain if so).

## Testing Expectations
- Every new service-layer method should have at least one unit test covering the main success path and at least one failure/edge case.
- Repository layer: prefer integration tests against a test SQLite instance over mocking the DB where practical.
- Auth/authorization logic (both RBAC and relationship-based checks) requires test coverage — this is the highest-risk area for silent bugs.

## Explicit Don'ts
- Don't introduce GORM or any other ORM alongside sqlc.
- Don't put authorization logic in handlers only — relationship-based checks belong in the service layer.
- Don't store JWTs anywhere JS-accessible.
- Don't generate frontend code in this repo.
- Don't silently change the data model from the original system without flagging it first.