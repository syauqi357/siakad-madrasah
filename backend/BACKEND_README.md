# Development Setup

### Initial Installation & Environment

First, install all dependencies and rebuild native modules to ensure they're compatible with Electron:

```terminal
npm install
```

This installs all Node.js dependencies defined in `package.json`, including Express, Drizzle ORM, Electron, and other runtime requirements.

```terminal
npm run electron:rebuild
```

This command rebuilds native C++ modules (like `better-sqlite3`) specifically for the Electron environment. This step is crucial because native modules compiled for Node.js won't work inside Electron's prebuilt binary without recompilation.

### Environment Configuration

Copy the environment template and fill in your local secrets and configuration:

```terminal
cp .env.example .env
```

Edit `.env` with your local database path, API port, and any other environment-specific variables. This file is not tracked in version control for security.

### Database Initialization

We use **Drizzle ORM with SQLite**. The setup process depends on whether you're starting fresh or updating an existing schema.

#### Fresh Start (First Time or Complete Reset)

If this is your first time setting up, or you want to wipe the database entirely and start fresh:

```terminal
npm run db:generate
```

This generates database migration files based on your Drizzle schema definition (usually in `src/db/schema.ts` or similar). Drizzle compares your schema against the current database state and creates `.sql` files for any changes.

```terminal
npm run db:push
```

This applies all pending migrations to your SQLite database, creating tables and relationships defined in your schema.

```terminal
npm run db:seed:global
```

This runs all global seed scripts in sequence:
- `seedAuth` — Creates default admin users, roles, and permissions
- `seedTeacher` — Populates sample teacher/guru data
- `seedMapelKurikulum` — Loads subject/curriculum data required by the system
- `seedClasses` — Creates sample student classes and groupings

After these commands, your database is ready to use with realistic initial data.

#### Schema Update Only (You Changed the Schema)

If you've modified your Drizzle schema and want to push changes without wiping data:

```terminal
npm run db:generate
npm run db:push
```

Drizzle detects the schema differences and generates safe migrations. Running `db:push` applies them without destroying existing data.

#### Full Reset (Nuke Everything)

If you need to completely reset the database — wiping all data, recreating tables, and reseeding:

```terminal
npm run db:fresh
```

This is more aggressive than `db:seed:global`. Use it when you've made breaking schema changes or the database is in an inconsistent state. It removes the database file entirely, regenerates migrations, and reseeds everything from scratch.

#### Optional: Visual Database Browser

If you want to inspect or manually edit your SQLite database:

```terminal
npm run db:studio
```

This opens Drizzle Studio, a web-based GUI for browsing and editing your database. It's optional and useful for debugging or understanding your data structure, but not required for development.

---

## 3. Running the Application

### Full Stack Development (Recommended Workflow)

```terminal
npm run electron:dev
```

This launches the complete application:
- **Backend**: Express server runs inside the Electron process
- **Frontend**: Electron window opens with your UI
- **Hot reload**: Both services work together; frontend can call backend APIs as if it were a separate server

Use this command for your normal development workflow. The frontend and backend communicate via HTTP (or IPC), exactly like in production. This is the best way to catch integration issues early.

### Backend-Only Development (Isolated API Work)

```terminal
npm run dev
```

This runs *only* the Express backend server using **nodemon** for automatic restarts whenever you modify files in `src/`.

Use this when:
- You're focusing purely on API logic and don't need the UI
- You're testing endpoints with Postman, curl, or similar tools
- You want faster iteration without waiting for Electron to launch

The backend will be available at `http://localhost:<YOUR_API_PORT>` (check `.env` for the port).

### Production Build

```terminal
npm run electron:build:win
```

Generates a production-ready Windows installer. The backend is bundled with the Electron app; no separate server deployment needed. Users download the installer and run it like any desktop application.

---