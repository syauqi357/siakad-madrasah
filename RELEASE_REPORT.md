# Platform Akademik Madrasah v1.0.0 - Release Report

## Release Overview

**Version:** 1.0.0
**Author:** Syauqi Husin
**License:** MIT
**Platform:** Windows (x64)
**Package Type:** NSIS Installer (.exe)

---

## What is Platform Akademik Madrasah?

Platform Akademik Madrasah is a standalone desktop application for managing academic data in Islamic schools (Madrasah). It is built to solve the real-world problem of managing student records, scores, and school administration without relying on complex spreadsheets or expensive enterprise software.

This application runs entirely offline on a single machine — no internet connection or external server required.

---

## How It Works

Platform Akademik Madrasah is packaged as an Electron desktop app that bundles a full Express.js backend server with a frontend interface. When you launch the application:

1. An embedded Express server starts on `localhost:3000`
2. A native desktop window opens and connects to the local server
3. All data is stored locally in an SQLite database
4. Uploaded files (student photos, documents) are stored in the user's app data directory

---

## Installation

1. Download the `Platform Akademik Madrasah Setup x.x.x.exe` installer
2. Run the installer — you can choose your installation directory
3. Launch from the desktop shortcut or Start Menu
4. The application will start automatically — no additional setup needed

---

## Technical Stack

| Component      | Technology                    |
| -------------- | ----------------------------- |
| Desktop Shell  | Electron 40                   |
| Backend Server | Express.js 5                  |
| Database       | SQLite (better-sqlite3)       |
| ORM            | Drizzle ORM                   |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| File Handling  | Multer                        |
| Export         | ExcelJS                       |
| Build Tool     | electron-builder (NSIS)       |

---

## Build Details

| Property       | Value                                      |
| -------------- | ------------------------------------------ |
| App ID         | `com.platform.akademik.madrasah`           |
| Target         | Windows x64 (NSIS Installer)               |
| Code Signing   | Not required                               |
| ASAR Packaging | Disabled (for native module compatibility) |
| Native Modules | better-sqlite3 (rebuilt for Electron)      |

---

## Features

- Student data management and enrollment
- Class group (Rombel) management
- Academic score recording and reporting
- Excel export functionality
- User authentication with role-based access
- File upload support (student photos, documents)
- Audit logging
- Rate limiting and security middleware
- Fully offline — no internet required

---

## Known Considerations

- The application runs a local server on port 3000. Ensure this port is not occupied by another application.
- On first launch, the database and upload files are copied to the user's AppData directory for persistent storage across updates.
- Windows Defender or antivirus software may prompt a warning since the installer is not code-signed. This is safe to allow.

---

## System Requirements

- **OS:** Windows 10/11 (x64)
- **RAM:** 4 GB minimum
- **Disk:** ~200 MB for installation
- **Port:** 3000 (localhost, used internally)
