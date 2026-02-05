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

| File | Purpose |
|------|---------|
| `electron/main.js` | Electron main process - starts Express server and creates window |
| `electron/preload.cjs` | Secure IPC bridge for renderer (CommonJS) |
| `electron-builder.json` | Build configuration for packaging |

## Native Module Notes

- **bcryptjs** is used instead of `bcrypt` (pure JS, no compilation needed)
- **better-sqlite3** requires prebuilt binaries (electron-builder handles this)
- Avoid paths with spaces when building (node-gyp issues)

## NSIS Installer Customization

### Required Images

| Image | Size | Format | Purpose |
|-------|------|--------|---------|
| `icon.ico` | 256x256 (multi-size) | ICO | App icon & installer icon |
| `installerHeader.bmp` | 150x57 px | BMP 24-bit | Top-right banner during install |
| `installerSidebar.bmp` | 164x314 px | BMP 24-bit | Left sidebar on welcome/finish |

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

| Type | Command | Output | Speed |
|------|---------|--------|-------|
| NSIS Installer | `npm run electron:build:win` | Setup .exe (installs once) | Fast after install |
| Portable | `npm run electron:build:portable` | Single .exe | Slow (extracts every launch) |
| Unpacked | (auto-generated) | `win-unpacked/` folder | Fastest (for testing) |

**Recommendation**: Use NSIS installer for distribution - users install once and the app runs fast.

