# PLANNING

---

this planning is observe the system is ready to use and provided as dynamical system of academic school platform.

---

## planning of API documentations

the documentations is about the API route system and the usage on `backend/routes` folder. there is 2 folder inside it `backend/routes/api` and `backend/routes/auditLog`.

expectations of API documentations is :

| no  | method | route            | description |
| --- | ------ | ---------------- | ----------- |
| 1   | `POST` | `route/endpoint` | dosomething |

this documentation is provide of usable and dynamic additional system with easier to understand the payload. whether it will be show the mechanism of architecture using layering method using controllers, services, routes, this make a proof of things will be sure for easier to maintain, refactor and works with team or opensource project

---

# About This Project

This project is a collaborative effort: approximately 60% "vibecoded" using Claude AI (Opus 4.5 and other models) and 40% developed by me, a frontend developer striving to complete this project independently. Here is the story behind it.

The journey began in 2024 when I was working as a school operator/administrator for two schools. I faced significant challenges managing student data. There was no centralized database or easy-to-use system—just raw data. Initially, I used Excel, but it eventually became sluggish even on high-end devices despite my optimization attempts. I tried migrating to Google Sheets, but faced incompatibility issues with macros and VBA scripts.

After three months of searching for a better solution, I realized that spreadsheets are not databases. I decided to build a web application, even if only for local use via a browser. Through research and trial and error, I adopted a methodology combining Agile Extreme Programming and open-source development practices.

My first attempt involved learning Express.js, but mastering the entire Node.js ecosystem took time. Consequently, I turned to AI for assistance. While I understand this might be controversial among some developers, I believe it's important to address a key issue: developers sometimes focus too much on system logic rather than user needs.

I faced criticism and was told I had "skill issues," but the reality is that hiring a developer is expensive. I offered 4 million IDR (a significant amount for me) to a developer for specific backend functions (Student and Score services), but received no response. In contrast, a $20 (approx. 350k IDR) subscription to Claude helped me solve these issues.

It is ironic that some developers criticize users for using AI instead of improving their own communication or understanding of user needs. Developers are paid to simplify lives, not complicate them. AI helps bridge that gap. While some claim AI is bad, it works, and often becomes a scapegoat for bugs, which feels like a double standard.

Ultimately, this project is now live and functional, helping others who face similar challenges. It also serves as the basis for my thesis research. I am currently sharing it with friends, colleagues, and the community for feedback while I work on migrating from Drizzle ORM to Prisma ORM with MySQL or PostgreSQL as database.

That is all I have to share here. I wanted to include this in the planning documentation. Hope you have a great day! :)

---

# Electron Desktop App Bundling

This project supports building as a standalone Windows desktop application using Electron.

## Quick Commands

```bash
cd backend

# Test in development mode
npm run electron:dev

# Build Windows installer
npm run electron:build:win
```

Output files will be in `backend/dist-electron/`.

## Key Configuration Files

| File                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `electron/main.js`                | Electron main process - starts Express server and creates window |
| `electron/preload.cjs`            | Secure IPC bridge for renderer (CommonJS)                        |
| `electron-builder.json`           | Build configuration for packaging                                |
| `afterPack.cjs`                   | Post-pack hook - replaces .exe icon using `rcedit`               |
| `build-resources/uninstaller.nsh` | Custom NSIS uninstall script - prompts user to delete app data   |

## Custom Icon (afterPack.cjs)

The default `signAndEditExecutable` in electron-builder fails on Windows due to `winCodeSign` symlink permission errors. To work around this:

- `signAndEditExecutable` is set to `false` in `electron-builder.json`
- `afterPack.cjs` runs after packaging and uses the `rcedit` package to replace the default Electron icon in the `.exe` with `build-resources/icon.ico`
- The `rcedit` dev dependency is required (`npm install --save-dev rcedit`)

**To change the app icon:** replace `backend/build-resources/icon.ico` with your new `.ico` file (must be a valid multi-size ICO, not a renamed PNG).

## Uninstaller Data Cleanup (uninstaller.nsh)

By default, NSIS does not remove user data (`%APPDATA%/SIAKAD Madrasah/`) on uninstall. The custom `build-resources/uninstaller.nsh` script adds a prompt during uninstall asking the user (in Indonesian) whether to delete their app data (database, settings) or keep it.

## Native Module Notes

- **bcryptjs** is used instead of `bcrypt` (pure JS, no compilation needed)
- **better-sqlite3** requires prebuilt binaries (electron-builder handles this)
- Avoid paths with spaces when building (node-gyp issues)

## NSIS Installer Customization

### Required Images

| Image                  | Size                 | Format     | Purpose                         |
| ---------------------- | -------------------- | ---------- | ------------------------------- |
| `icon.ico`             | 256x256 (multi-size) | ICO        | App icon & installer icon       |
| `installerHeader.bmp`  | 150x57 px            | BMP 24-bit | Top-right banner during install |
| `installerSidebar.bmp` | 164x314 px           | BMP 24-bit | Left sidebar on welcome/finish  |

### File Locations

```
backend/
  build-resources/
    icon.ico              # App & installer icon
    installerHeader.bmp   # Top-right banner
    installerSidebar.bmp  # Left sidebar
```

### Design Tips

- **Header (150x57)**: Logo + app name, keep simple
- **Sidebar (164x314)**: Vertical banner, logo at top, gradient or solid background
- **Icon**: Include multiple sizes (16, 32, 48, 64, 128, 256) in the .ico file
- Convert PNG to BMP using Paint, Photoshop, or online tools (save as 24-bit, no transparency)

## Build Types Comparison

| Type           | Command                           | Output                     | Speed                        |
| -------------- | --------------------------------- | -------------------------- | ---------------------------- |
| NSIS Installer | `npm run electron:build:win`      | Setup .exe (installs once) | Fast after install           |
| Portable       | `npm run electron:build:portable` | Single .exe                | Slow (extracts every launch) |
| Unpacked       | (auto-generated)                  | `win-unpacked/` folder     | Fastest (for testing)        |

**Recommendation**: Use NSIS installer for distribution - users install once and the app runs fast.

---

# Backend Folder Structure Suggestion

## Current State

Right now the backend layout is flat -- `controllers/`, `services/`, `routes/`, `middlewares/`, `utils/` all sit at the backend root, while `src/` only holds database config (`src/db/schema/`).

```
backend/
  app.js
  controllers/
  services/
  routes/
  middlewares/
  utils/
  src/db/schema/
  public/
  electron/
  build-resources/
  drizzle/
```

## Suggestion: Consolidate application code under `src/`

Yes, it is safe to move controllers, services, routes, and middlewares into `src/`. This is a common Node.js/Express convention. The idea is that `src/` holds all application source code, while config files, build artifacts, and tooling stay at the backend root.

### Proposed structure

```
backend/
  app.js                        # entry point (imports from src/)
  package.json
  drizzle.config.js
  electron-builder.json
  afterPack.cjs
  siakad.db
  .env
  node_modules/
  build/                        # compiled frontend
  public/                       # static uploads
  electron/                     # electron files
  build-resources/              # installer assets
  drizzle/                      # migration files
  src/
    controllers/                # request handlers
    services/                   # business logic
    routes/
      api/                      # API routes
      auditLog/                 # audit log routes
    middlewares/                 # auth, audit, rate-limit
    utils/                      # helpers
    db/
      schema/                   # drizzle ORM schemas
      index.js                  # db connection
      seed.js
      seedscore.js
```

### What goes inside `src/`

| Folder             | What belongs here                                             |
| ------------------ | ------------------------------------------------------------- |
| `src/controllers/` | Request handlers - parse request, call service, send response |
| `src/services/`    | Business logic - validation, data transformation, db calls    |
| `src/routes/`      | Express Router definitions (api + auditLog)                   |
| `src/middlewares/` | verifyToken, audit middleware, rate limiter                   |
| `src/utils/`       | Password generator, seed helpers, shared utilities            |
| `src/db/`          | Database connection, schema definitions, seeds                |

### What stays at backend root (outside `src/`)

| Item                | Why                                               |
| ------------------- | ------------------------------------------------- |
| `app.js`            | Entry point - keeps `node backend/app.js` working |
| `package.json`      | Package config                                    |
| `drizzle.config.js` | ORM config                                        |
| `.env`              | Environment variables                             |
| `electron/`         | Electron-specific (separate concern)              |
| `build-resources/`  | Installer assets                                  |
| `build/`            | Compiled frontend output                          |
| `public/`           | Static file uploads                               |
| `drizzle/`          | Migration files (generated by drizzle-kit)        |
| `siakad.db`         | Database file                                     |

### Migration steps

1. Move `controllers/` to `src/controllers/`
2. Move `services/` to `src/services/`
3. Move `routes/` to `src/routes/`
4. Move `middlewares/` to `src/middlewares/`
5. Move `utils/` to `src/utils/`
6. `src/db/` already exists -- no change needed
7. Update all `import` paths in `app.js` and across moved files (e.g. `'./controllers/...'` becomes `'./src/controllers/...'` in app.js, or relative paths between src files stay the same)
8. Test the app to make sure all routes still work

### Important notes

- **Relative imports between files inside `src/` mostly stay the same** since the folder hierarchy (controllers -> services -> db) keeps the same relative positions.
- **Only `app.js` imports change significantly** since it currently imports from `./controllers/...`, `./routes/...`, etc. and those become `./src/controllers/...`, `./src/routes/...`.
- **drizzle.config.js** may reference `src/db` paths -- check that these still resolve correctly.
- **This is not urgent.** The current flat structure works fine. You can do this refactor whenever you feel ready -- just make sure to test all routes after moving files.
