# Development of an Offline-First Academic Information System for Madrasah Using Personal Extreme Programming: A Case Study of MTs. Al-Hasyimiy

**Authors:** Syauqi Husin
**Affiliation:** [Department / University]
**Corresponding Author:** m.syauqi357@gmail.com

---

## Abstract

Many Indonesian madrasahs still rely on spreadsheets for academic data administration, which leads to data fragmentation, slow performance on large datasets, and difficulty in producing standardized reports. This study presents the design, implementation, and evaluation of SIAKAD Madrasah, an offline-first desktop academic information system tailored for the operational context of MTs. Al-Hasyimiy in Pasuruan, East Java. The system is developed using the Personal Extreme Programming (PXP) methodology, an Agile variant adapted for solo developers, with SvelteKit on the frontend, Express.js on the backend, SQLite through Drizzle ORM as the data store, and Electron.js as the desktop runtime. The development process spanned approximately 3.5 months and produced 491 commits distributed across 12 dynamically-scoped iterations, all traceable through Git version control. White-box testing using the Jest framework was applied to memory-intensive functions, particularly Excel bulk-upload and template-generation routines, with all 11 test cases passing. Two rounds of user feedback obtained through unstructured interviews and direct observation drove two notable improvements: the addition of tooltips on the Excel-upload feature to improve discoverability, and the migration of the application distribution mechanism from a manually-executed batch file to an NSIS installer that bundles the system through Electron. The latter change increased the estimated installation success rate from approximately 30% to 95%. The results demonstrate that PXP, combined with an offline-first deployment model, can deliver a maintainable, low-friction academic platform that fits the constrained infrastructure of Indonesian madrasahs while remaining responsive to evolving user needs.

**Keywords:** academic information system, madrasah, Personal Extreme Programming, offline-first, Electron.js, white-box testing

---

## 1. Introduction

Educational institutions at the secondary level in Indonesia, especially madrasahs, have long handled academic administration through spreadsheet applications such as Microsoft Excel and Google Sheets. In effect, the spreadsheet serves as the de facto blueprint for academic data management, it predates any formal academic information system in most madrasahs and remains widely adopted today. The challenge, therefore, is not the absence of a tool but the absence of architectural rigor in the tool that is already in place: although spreadsheets offer immediate accessibility for daily tasks such as managing student records, recording academic scores, organizing class assignments, and producing reports for stakeholders, they were never designed as a relational system, and several structural weaknesses surface as workloads grow. First, performance degrades on capable hardware as datasets expand. Second, there is no relational integrity between entities (students, parents, classes, scores), so cross-referencing a student's record across files is largely manual. Third, and most disruptive in everyday operations, data becomes inconsistent across contributors: when one teacher maintains records for twelve students while another independently maintains records for twenty-four students from overlapping cohorts, a single source of truth never emerges, and reconciling versions in real time becomes a recurring source of friction. Audit trails and role-based access are similarly absent, leaving the institution without a traceable record of who edited what and when. This research responds to that gap by replacing the ad-hoc spreadsheet workflow with a purpose-built academic information system. The chosen development methodology is Agile, whose iterative mechanism, refined over more than two decades and still in active industry use, accommodates requirements that emerge gradually through institutional use rather than being fully captured upfront, and absorbs user feedback into the next release without waiting for a major version cycle.

The case institution in this study, MTs. Al-Hasyimiy located in Bangil, Pasuruan, Regency, East Java, exhibits the typical characteristics of small to medium-sized madrasahs in Indonesia: limited internet connectivity in administrative offices, modest hardware resources, and a single staff member responsible for handling academic data of multiple cohorts simultaneously. Cloud-based academic systems are often unsuitable in this context because of bandwidth constraints, recurring subscription costs, and concerns about the locality of student data.

To respond to these constraints, this research designs and implements SIAKAD Madrasah, an offline-first desktop academic information system. The system is developed using the Personal Extreme Programming (PXP) methodology [3], an Agile variant of Extreme Programming [2] that is specifically suited to solo-developer projects, where ceremonies common in team-based methods such as Scrum [10] are not applicable. The deployment model is intentionally chosen as a desktop application packaged with Electron.js so that the institution can install and use the system without depending on external servers, while still benefiting from a modern web-based user interface.

The contributions of this paper are threefold. First, we present a complete account of the iteration history of the project, derived through retrospective trace analysis of 491 Git commits across 12 iterations, as empirical evidence of the PXP cycle in practice. Second, we describe the architecture and implementation of the system, covering the frontend, backend, database, middleware, and desktop bundling. Third, we report two cycles of user feedback collected during the maintenance phase and demonstrate how those observations were translated into concrete improvements within subsequent iterations.

The remainder of the paper is organized as follows. Section 2 describes the research method, including the rationale for choosing PXP, the requirements analysis approach, and the testing strategy. Section 3 presents the results and discussion, covering the implemented user interface, backend architecture, database schema, distribution model, white-box testing outcomes, and user feedback. Section 4 concludes the paper and outlines directions for future work.

---

## 2. Method

### 2.1 Research Methodology and Rationale

The development methodology applied in this research follows the Agile philosophy [1], which favors iterative and incremental delivery, working software over comprehensive documentation, and responsiveness to change over rigid plan adherence. Within the Agile family, the specific variant used is Personal Extreme Programming (PXP) [3], an adaptation of Extreme Programming (XP) [2] designed for solo developers.

PXP was selected over team-oriented Agile frameworks for three reasons. First, the development was carried out by a single developer, which makes Scrum and Kanban unsuitable because they require defined roles such as Product Owner and Scrum Master and rely on collaborative ceremonies [10]. Second, feedback from end users was received informally and directly through WhatsApp, requiring rapid hotfix turnaround rather than fixed sprint cycles [23]. Third, PXP allows iteration scope and duration to be adjusted dynamically according to the complexity of features being developed [9].

The core PXP practices applied throughout the project include continuous testing [17], structured layout of source code [7], regular code refactoring [11], simple design that avoids over-engineering [27], consistent coding standards [27], and measured release planning [18]. These practices are intended to produce a system with high maintainability [4], extensibility, and resistance to regression as new features are added. The overall PXP cycle followed in this study is illustrated in Figure 1.

![Figure 1. Personal Extreme Programming (PXP) Cycle](/imageresearch/XP.png)
_Figure 1. Personal Extreme Programming (PXP) cycle, showing the six phases (Requirements, Planning, Iteration, Productionizing, Maintenance, and Death) applied iteratively throughout the development of SIAKAD Madrasah_

### 2.2 Requirements Analysis and System Design

Prior to full iterative implementation, an exploration phase was conducted at the case institution. Functional and non-functional requirements [4] were elicited through unstructured interviews and direct observation [24] of administrative workflows. The findings were modeled using a Use Case Diagram in UML 2.x notation [21], as shown in Figure 2.

![Figure 2. Use Case Diagram of SIAKAD Madrasah](/imageresearch/use-case-diagram-siakad-sekolahv3.png)
_Figure 2. Use Case Diagram of the SIAKAD Madrasah academic information system, depicting the School Admin actor with full access to all modules after authentication and the Client/Parent/Teacher actor with conditional access to the public score-viewing feature_

Two actors were identified: (1) **School Admin** as the primary actor with full access to all modules after authentication, and (2) **Client/Parent/Teacher** as a secondary actor with limited access only to a public score-viewing feature, accessible without login. The two-actor model intentionally avoids implementing a full Role-Based Access Control (RBAC) layer, in line with the *simple design* principle of Extreme Programming [27] and the YAGNI (You Ain't Gonna Need It) principle [2]. Access separation is achieved through a single conditional `«extend»` relationship in the Use Case Diagram rather than through a heavyweight role-management subsystem.

The system was decomposed into three functional domains: (1) authentication and authorization, (2) the dashboard as a navigation hub, and (3) academic data management covering CRUD operations for students, parents, classes, teachers, subjects, scores, academic years, curricula, school profile, audit logs, account management, and reports.

### 2.3 Implementation Stack

The system was implemented using the following technology stack:

- **Frontend:** SvelteKit, chosen for its small runtime footprint and compile-time optimization, suitable for delivering a Single Page Application within an Electron shell.
- **Backend:** Express.js (version 5) on Node.js, structured following an MVCS (Model-View-Controller-Services) layered pattern [21] that separates routes, controllers, and services.
- **Database:** SQLite, accessed through Drizzle ORM. SQLite was chosen because it stores all data in a single file, requires no separate server, and is therefore aligned with the offline-first deployment goal.
- **Desktop runtime:** Electron.js, packaged into a Windows installer through electron-builder with NSIS (Nullsoft Scriptable Install System) [18].
- **Testing:** Jest as the test runner and assertion library.

### 2.4 Iteration Documentation

All development activity was tracked with Git [13]. Iteration boundaries were established after the fact through retrospective trace analysis of the commit history, using two criteria: (1) temporal proximity between consecutive commits and (2) thematic cohesion of the features being worked on. Each iteration was documented with six attributes: iteration number, time period, number of commits, initial commit hash (SHA), terminal commit hash, and development focus. The use of immutable SHA identifiers enables independent third-party verification of the development trajectory through point-in-time reproducibility [13].

### 2.5 Testing Strategy

The testing strategy applied White-Box Testing [7], also known as structural or glass-box testing, focusing on internal logic, branching structure [14], execution flow, and boundary-condition handling [15] of memory-intensive functions. The conceptual contrast between black-box and white-box testing is illustrated in Figure 3. The two main targets were: (1) Excel parsing and bulk-upload functions, and (2) dynamic Excel template generation. These were chosen because empirical evidence during development showed that they were the most prone to memory-related issues [16] and produced the highest rate of unexpected behavior when input deviated from validation rules [26].

![Figure 3. Illustration of White-Box Testing](/imageresearch/testingdiffcomparison.png)
_Figure 3. Conceptual illustration of white-box testing, where verification targets the internal logic and branching structure of the source code rather than only the externally observable input/output behavior_

External dependencies (the Drizzle database connection and the ExcelJS library) were isolated using `jest.unstable_mockModule()` so that tests would be deterministic and not require an active database [15]. Test cases verified internal field-mapping logic, the number of `insert()` calls inside transactions, the propagation of identifiers between related tables, and the structural correctness of generated workbooks. The overall flow of a single test case for the Excel upload and template functions is shown in Figure 4.

![Figure 4. Unit Test Flow for Excel Upload and Template Functions](/imageresearch/flowchart-unittestflow.drawio.png)
_Figure 4. Unit-test execution flow for the Excel upload and template-generation functions, showing dependency mocking, function execution, output verification, and pass/fail decision points_

### 2.6 Maintenance and Feedback Collection

After each release, feedback was collected through the same techniques used in the requirements phase: unstructured WhatsApp-based interviews and direct observation of user interaction. This continuous-feedback loop is consistent with the *customer collaboration* value of the Agile Manifesto [1] and the *continuous improvement* principle. Issues identified through this channel were prioritized and integrated into subsequent iterations.

---

## 3. Result and Discussion

### 3.1 Iteration History and Commit Distribution

The development cycle produced 491 commits between 15 November 2025 and 25 February 2026, distributed across 12 iterations. The first commit hash is `61714e4` and the final commit hash is `9ce922c`. Table 1 summarizes the iteration history, and Figure 5 visualizes the commit distribution per iteration.

**Table 1. Iteration History of SIAKAD Madrasah Development**

```csv
No,Iteration,Period,Commits,Initial SHA,Terminal SHA,Development Focus
1,Iteration 1,15–16 Nov 2025,51,61714e4,4bc80eb,"SvelteKit initialization, navbar/sidebar components, main layout, Express server setup, frontend routing"
2,Iteration 2,17–21 Nov 2025,64,97dd77d,0e16540,"Student data page, skeleton loader, initial audit logs, layout/styling fixes, Node.js adapter"
3,Iteration 3,28 Nov–8 Dec 2025,19,442c441,2add81a,"Sidebar dropdown, student-data backend wiring, icons & routes, concurrently.js setup"
4,Iteration 4,10–17 Dec 2025,89,ca677d4,a33b61a,"Login authentication, Drizzle ORM + SQLite integration, environment variables, full audit logs, dashboard layout"
5,Iteration 5,20–21 Dec 2025,8,fe59d6e,e8b9530,"Dashboard calendar, username settings, UI fixes"
6,Iteration 6,1–12 Jan 2026,72,d89fdeb,030b905,"JSON data restructuring, student detail layout, student input form, Excel upload (multer + exceljs), pnpm migration, relational schema"
7,Iteration 7,13–18 Jan 2026,54,ffff8c2,9685b74,"Score & subject schema, rate limiter middleware, JWT auth, Excel template feature, student address form"
8,Iteration 8,19–27 Jan 2026,36,e02df2c,fc65667,"Rombel CRUD management, score management, student bulk upload, rombel/class services, modal components"
9,Iteration 9,28–31 Jan 2026,40,386e53d,730df0e,"Teacher & assignment features, exam management, graduation feature, school profile with logo upload, error pages"
10,Iteration 10,1–5 Feb 2026,27,ee1c24f,19478b2,"Refactoring, Electron.js bundling for desktop, Windows executable build, documentation"
11,Iteration 11,7–14 Feb 2026,19,da9942d,397d1cd,"Bug fixes, rombel/mutation page redesign, UML class diagram, academic year & curriculum API integration, seed data"
12,Iteration 12,22–25 Feb 2026,12,5e6ffdd,9ce922c,"School asset management, database migration, auth seedfile, folder restructuring, file handler fixes"
```

![Figure 5. Distribution of Commits per Iteration](/imageresearch/chart-grafik-iterasi.png)
_Figure 5. Distribution of Commits per Iteration across the 12-iteration development cycle of SIAKAD Madrasah_

The variation in commit count between iterations, ranging from 8 in Iteration 5 to 89 in Iteration 4, reflects the dynamic nature of PXP, where iteration scope is adjusted to feature complexity rather than enforced by a fixed sprint length [27]. Heavy iterations correspond to phases where significant new subsystems were introduced (e.g., authentication and database integration in Iteration 4; bulk Excel handling in Iteration 6), whereas lighter iterations reflect stabilization or smaller incremental improvements.

Three macro-phases are visible across the timeline. Iterations 1–3 focused on user-interface scaffolding. Iterations 4–9 implemented core academic functionality and the data layer. Iterations 10–12 transitioned the system from a development prototype into a deployable desktop product, including the Electron bundling effort.

### 3.2 Implemented User Interface

The application contains the following primary screens, each consistent with the use cases identified during requirements analysis:

- **Landing Page**: Public entry point including a hero section, a bento-grid feature summary, and a public *Score Preview* feature that implements the conditional `«extend»` use case for the Client/Parent/Teacher actor. The score preview consumes `/routes/api/score/scorebyclass` without requiring a JWT token.
- **Login Page**: Authentication form. The `POST /login` endpoint verifies credentials with bcryptjs and issues a JWT valid for 24 hours, stored in the browser's `localStorage`.
- **Dashboard**: Welcome card, school information summary, statistical widgets, calendar widget, and quick-access navigation cards. Layout uses a responsive CSS grid.
- **Student Management**: List view with debounced search (600 ms), status filter, pagination, and bulk Excel upload. Add/Edit form is split into three tabs (student, parents, guardian) with photo upload and structured address fields. Detail page exposes Edit, Delete, Mutation, and Graduation actions.
- **Rombel (Class Group) Management**: Card grid with capacity progress bars (color-coded: green ≤70%, blue ≤90%, yellow >90%) and per-rombel score-template downloads.
- **Score Management**: Bento-grid landing for Task, Exam, and Subject scores; download of pre-populated Excel templates; upload of completed score sheets in either per-assessment or pivot format.
- **Teacher Management**: Two-tab interface (List / Add) with inline edit support and confirmation modals on delete.
- **School Data**: Read-mode by default; logo upload supports JPG, PNG, GIF, SVG, and WebP up to 5 MB.
- **Academic Year and Curriculum**: Activation logic enforces a single active record at any time.
- **Audit Log**: Read-only view of all system activity, filterable by action type, user, status, time range, and free-text search.

Figures 6 through 9 illustrate selected screens from the implemented user interface, anchoring the description above with concrete visual evidence of the delivered system.

![Figure 6. Landing Page](/imageresearch/bab-4/Screenshot%202026-04-12%20160107.png)
_Figure 6. Landing page of SIAKAD Madrasah, including the hero section, feature bento grid, and the public score-preview feature accessible without authentication_

![Figure 7. Main Dashboard](/imageresearch/bab-4/Screenshot%202026-04-12%20160131.png)
_Figure 7. Main dashboard shown after admin authentication, containing the school information card, statistical widgets, calendar widget, and quick-access navigation cards_

![Figure 8. Student Management List](/imageresearch/bab-4/Screenshot%202026-04-12%20160243.png)
_Figure 8. Student management list view with debounced search, status filter, pagination, and action buttons for adding, downloading the template, and bulk-uploading student data_

![Figure 9. Bulk Excel Upload Modal](/imageresearch/bab-4/Screenshot%202026-04-12%20160259.png)
_Figure 9. Bulk Excel upload modal on the student data page, showing the two-step workflow of downloading the formatted template and uploading the completed file_

### 3.3 Backend Architecture

The backend is structured following a three-layer pattern. Routes define HTTP endpoints and dispatch to controllers; controllers validate request payloads and return JSON responses without containing business logic; services encapsulate business logic and database interactions through Drizzle ORM, with multi-table operations wrapped in transactions to ensure consistency.

Three middleware layers govern request handling:

1. **`verifyToken`** validates the JWT supplied in the `Authorization: Bearer <token>` header and attaches the decoded user to the request object.
2. **`middlewareAudit`** persists every relevant API request to the `auditLog` table, automatically classifying the action (Created, Updated, Deleted, Viewed) and the affected entity based on URL and HTTP method, while applying a 30-minute cache for repeated GET requests to limit log volume.
3. **`rateLimiter`** caps requests at 300 per 15-minute window per client and responds with HTTP 429 when exceeded.

Table 2 summarizes the principal API endpoints exposed by the backend.

**Table 2. Primary API Endpoints**

| No | Module | Endpoint | Method | Description |
| --- | --- | --- | --- | --- |
| 1 | Authentication | `/login` | POST | User login |
| 2 | Authentication | `/logout` | POST | User logout |
| 3 | Authentication | `/change-password` | POST | Change password |
| 4 | Student | `/studentDataSet` | GET | Paginated student list |
| 5 | Student | `/studentDataSet/search` | GET | Student search |
| 6 | Student | `/students` | POST | Create student |
| 7 | Student | `/students/:id` | PUT/DELETE | Update or delete student |
| 8 | Student | `/students/upload-bulk` | POST | Bulk Excel upload |
| 9 | Student | `/students/download-template` | GET | Download Excel template |
| 10 | Rombel | `/rombel`, `/rombel/:id` | GET/POST/DELETE | Class-group CRUD |
| 11 | Score | `/scores`, `/upload`, `/upload-bulk` | POST | Save and upload scores |
| 12 | Score | `/template/:rombelId` | GET | Download score template |
| 13 | Teacher | `/teachers`, `/teachers/:id` | GET/POST/PUT/DELETE | Teacher CRUD |
| 14 | School | `/schoolData` | GET/POST/PUT | School profile |
| 15 | Subject | `/subjects` | GET/POST | Subjects |
| 16 | Academic Year | `/academic-years` | GET/POST | Academic years |
| 17 | Curriculum | `/curriculum` | GET/POST | Curricula |
| 18 | Audit Log | `/audit-logs` | GET | System activity history |
| 19 | Graduate | `/graduates` | GET/POST | Graduation processing |
| 20 | Promotion | `/promotion/promote` | POST | Class promotion |

### 3.4 Database Implementation

The database comprises 22 tables managed through Drizzle ORM. Schema definitions are written in JavaScript, which keeps the structure documented and version-controllable. Table 3 lists the major tables and their roles.

**Table 3. Database Tables**

| No | Table | Function |
| --- | --- | --- |
| 1 | `users` | User accounts (username, password hash, role) |
| 2 | `studentTable` | Student identity records |
| 3 | `studentFather` / `studentMother` / `studentWali` | Parent and guardian data |
| 4 | `studentAddress` | Student addresses |
| 5 | `studentScore` | Student scores per subject and assessment type |
| 6 | `studentHistory` | Student status history (mutation, graduation) |
| 7 | `studentAttendance` | Student attendance |
| 8 | `rombel` / `rombelStudents` | Class groups and student-rombel junction |
| 9 | `classes` | Grade levels (VII–XII) |
| 10 | `teachers` | Teacher records |
| 11 | `subjects` | Subjects with KKM thresholds |
| 12 | `classSubject` | Subject-to-class-and-teacher assignments |
| 13 | `assessmentType` | Assessment categories with weights (UH, UTS, UAS) |
| 14 | `academicYear` / `curriculum` | Academic year and curriculum references |
| 15 | `schoolDataTable` / `schoolFacilities` / `buildingsSchool` | School profile and assets |
| 16 | `auditLog` | System activity records |

Foreign keys link related entities — for example, `studentFather`, `studentMother`, `studentWali`, and `studentAddress` are joined to `studentTable` through `studentId`. The `rombelStudents` table acts as a junction table for the many-to-many relationship between students and class groups. `studentScore` joins `studentTable`, `classSubject`, and `assessmentType`. Unique constraints on NISN, local NIS, BPJS number, ID number, and birth-certificate number enforce identity integrity. Business invariants such as the single-active-record rule for academic year and curriculum are enforced at the service layer.

### 3.5 White-Box Testing Outcomes

White-box testing was conducted using Jest with mocked Drizzle and ExcelJS dependencies. The test suite produced 11 cases distributed across four functions, all of which passed. The verification focus for each case is summarized below.

**Table 4. White-Box Test Results — `createBulkStudentsFromExcel()`**

| No | Test Case | Verified Aspect | Status |
| --- | --- | --- | --- |
| 1 | Parse Excel and insert all student fields | All 18 student fields (including `previousSchool`, `phoneNumber`, `childOrder`, `siblingsCount`, `nationality`, `livingWith`, `transportation`, `bpjs`, `idCardNumber`, `birthCertificateNumber`) map correctly from Excel columns to `insert()` parameters | Pass |
| 2 | Father field mapping (`job` → `occupation`, `phone` → `phoneNumber`) | Internal field-mapping logic converts Excel labels to database column names, including `nik`, `birthPlace`, `birthYear`, `education`, `monthlyIncome`, `isAlive` | Pass |
| 3 | Mother field mapping | Identical mapping logic for mother data, ensuring no regression | Pass |
| 4 | Insert address from Excel columns | Address fields (`street`, `houseNumber`, `rt`, `rw`, `village`, `subDistrict`, `postalCode`) inserted with the correct `studentId` from the returning student insert | Pass |

**Table 5. White-Box Test Results — `createStudentData()` and `createStudentdataInputExcelBulkGenerator()`**

| No | Test Case | Verified Aspect | Status |
| --- | --- | --- | --- |
| 1 | Create student with parent data in a single transaction | Function executes exactly three `insert()` calls within one `transaction()` (student, father, mother); `studentId` from the first insert flows to the next two through the mocked `returning().get()` chain | Pass |
| 2 | Generate Excel template with correct headers and styling | Workbook structure includes the `Data Siswa Bulk Upload` worksheet, the expected column headers, and the `font.bold` and `fill.type` properties on the header row | Pass |

**Table 6. White-Box Test Results — `registerRombel()`**

| No | Test Case | Verified Aspect | Status |
| --- | --- | --- | --- |
| 1 | Register rombel with full student data | Function calls `insert()` exactly twice within a `transaction()` (rombel + student batch); `rombelId` from `returning().all()` propagates to each student record; `update()` is called once to synchronize `studentTable` | Pass |
| 2 | Register rombel with empty student array | Branching logic: when `payload.siswa` is an empty array, only the rombel insert runs (single `insert()` call) | Pass |

**Table 7. White-Box Test Results — `generateBulkScoreTemplate()`**

| No | Test Case | Verified Aspect | Status |
| --- | --- | --- | --- |
| 1 | Generate score template with subjects fetched from the database | Function fetches subjects through the mocked `select().from()` (returning `Matematika`, `IPA`); the `Bulk Scores` worksheet header is dynamically constructed as `['NISN', 'Nama Siswa', 'Matematika', 'IPA']` | Pass |

The 100% pass rate across these targeted cases indicates that the most data-intensive paths in the system handle field mapping, transaction sequencing, and dynamic workbook generation as designed. Equally important, the deterministic mocking strategy means that this test suite can be re-executed in continuous-integration pipelines without requiring a populated database.

### 3.6 Maintenance Phase and User Feedback

Two cycles of user feedback during the maintenance phase produced concrete improvements.

**Feedback 1 — Excel Upload Discoverability.** Administrative staff reported that the Excel upload feature on the Student Data page lacked sufficient guidance. Buttons were unlabeled with auxiliary explanation, leading users to be unsure whether they should download the template first or upload data directly. In response, the developer added a tooltip on the *Unduh Template* (Download Template) button explaining that it produces an empty `.xlsx` formatted to the system's expected column layout, ready to be filled in and uploaded. This change embodies the *user-centered design* principle [6], which prioritizes the user's mental model over the developer's mental model of the interface.

**Feedback 2 — Installation Mechanism.** Version 1.0 of the system was distributed as a `.bat` (batch) file requiring users to navigate the file system manually and execute the script, after which a command prompt window opened in parallel with the browser. Non-technical users were confused by both steps. Starting from version 2.0, the application was rebundled as an Electron desktop application and packaged through NSIS into a standard `Setup.exe` installer. This eliminates the manual-execution step, removes the visible command-prompt window, and provides standard uninstall behavior through Windows' Add/Remove Programs. Figure 10 contrasts the two distribution mechanisms at the architecture level, and Table 8 summarizes the practical differences.

![Figure 10. Distribution Mechanism Comparison](/imageresearch/deploymentdiagram.png)
_Figure 10. Deployment diagram comparing the v1.0 batch-file distribution mechanism with the v2.0+ Electron/NSIS installer mechanism, highlighting the change in execution environment, database location, and user-facing entry point_

**Table 8. Distribution Mechanism Comparison**

| Aspect | v1.0 (Batch File) | v2.0+ (Electron) |
| --- | --- | --- |
| Distribution | `run.bat` | `Setup.exe` (NSIS) |
| Execution environment | Node.js (exposed) | Electron (bundled) |
| User interface | Terminal + browser | Native desktop window |
| Database location | Project folder | `%APPDATA%` (isolated) |
| Uninstall | Manual deletion | Add/Remove Programs |
| Setup time | 5–10 minutes | ~2 minutes |
| Estimated success rate | ~30% | ~95% |

The shift in distribution mechanism is more than a cosmetic change. By relocating the SQLite database file to `%APPDATA%/SIAKAD Madrasah/`, the system separates user data from the installation directory, which preserves data across application updates and reinstallations. The custom NSIS uninstaller also displays a localized prompt asking the user whether to retain or delete the database during uninstall, giving the institution explicit control over data retention.

### 3.7 Discussion

Three observations emerge from these results.

First, PXP proved viable for a non-trivial domain application built by a single developer. The 12-iteration history demonstrates that adjusting iteration scope to feature complexity, rather than to a fixed sprint length, produces a development cadence that matches the natural rhythm of solo work. Iterations were neither uniformly small nor uniformly large; instead, they scaled with the cognitive load of each feature.

Second, the offline-first deployment model, SQLite + Electron, addresses two structural constraints of the case institution that cloud-based academic systems do not: connectivity dependence and recurring cost. By packaging the entire system as a desktop installer, the institution receives a one-time install with no ongoing subscription, no exposure to internet outages, and full local control over student data.

Third, the maintenance feedback loop confirms that even small usability investments, a tooltip, a proper installer, can yield disproportionate returns in user adoption. The estimated jump in installation success rate from approximately 30% to 95% is the clearest evidence that the bottleneck was never the application logic, but the friction at the boundary between the user and the system.

---

## 4. Conclusion

This research has presented the design, implementation, and field deployment of SIAKAD Madrasah, an offline-first desktop academic information system developed by a single developer using Personal Extreme Programming and evaluated as a case study at MTs. Al-Hasyimiy. The implemented system covers the administrative surface required by the case institution — student, parent, teacher, class group, score, academic year, curriculum, school profile, and audit-log management — through a SvelteKit frontend, an Express.js backend organized in a layered (route–controller–service) architecture, a SQLite database accessed via Drizzle ORM, and an Electron-packaged desktop distribution. Within the scope of this single case, three observations can be drawn.

First, the 491 commits across 12 retrospectively-defined iterations document a solo-developer cadence in which iteration scope tracked feature complexity rather than fixed sprint length; because boundaries were drawn after the fact, this is a process record rather than a controlled validation of PXP.

Second, the white-box tests against memory-intensive Excel functions all passed, verifying internal correctness on the covered paths but not runtime reliability or workflow coverage.

Third, two feedback cycles produced two concrete changes — bulk-upload tooltips and an NSIS-packaged Electron installer; direct observation at the case institution suggested the installer materially eased installation, though not measured under controlled conditions.

The contribution of this work is therefore narrow but concrete: a documented account of one solo-developer effort to produce a locally-deployable academic system that fits the constraints of a single madrasah, together with the limitations and lessons surfaced through the process.

Several directions follow naturally from the limitations of this study. First, the empirical scope is bounded by a single case institution; replicating the development and deployment process at additional madrasahs of varying size would test whether the offline-first model holds beyond MTs. Al-Hasyimiy. Second, the usability evidence currently relies on unstructured interviews and direct observation, which are useful for surfacing issues but cannot quantify perceived usability; a follow-up study using validated instruments such as the System Usability Scale (SUS) or User Experience Questionnaire (UEQ) would place the qualitative findings on firmer ground. Third, the testing strategy presented here is restricted to white-box unit tests against memory-intensive functions; complementary end-to-end testing through tools such as Playwright or Cypress would extend coverage to full user workflows. Fourth, while the offline-first SQLite deployment fits a single-institution context, scenarios involving multiple madrasahs under one foundation or district would require a shared persistence layer; a migration path toward PostgreSQL or MySQL through Prisma ORM is one such direction, though preserving the offline-first guarantees of the current system within any networked variant remains an open design question. The estimated installation success rates reported in this work were derived from informal observation at the case institution and should be treated as indicative rather than measured; a controlled deployment study across institutions would be required to characterize this rigorously.

---

## Acknowledgements

The author would like to thank the administrative staff and leadership of MTs. Al-Hasyimiy, Bangil, Pasuruan, for their willingness to take part in interviews, observations, and usability feedback during the development of this system. Thanks also go to academic supervisors for their guidance on the research design, and to colleagues who reviewed early drafts of both the system and the manuscript. This work additionally depends on a number of open-source projects such as Node.js, Express.js, SvelteKit, Drizzle ORM, SQLite, ExcelJS, Jest, and Electron.js.

---

## References

[1] K. Beck et al., *Manifesto for Agile Software Development*. Agile Alliance, 2001. [Online]. Available: https://agilemanifesto.org/

[2] K. Beck, *Extreme Programming Explained: Embrace Change*. Addison-Wesley, 1999.

[3] Y. Dzhurov, I. Krasteva, and S. Huber, "Personal Extreme Programming — An Agile Process for Autonomous Developers," in *Proc. Int. Conf. on Software, Services & Semantic Technologies*, 2009.

[4] R. S. Pressman, *Software Engineering: A Practitioner's Approach*, 8th ed. McGraw-Hill Education, 2014.

[5] I. Sommerville, *Software Engineering*, 10th ed. Pearson Education, 2016.

[6] D. A. Norman, *The Design of Everyday Things*, Revised ed. Basic Books, 2013.

[7] S. McConnell, *Code Complete: A Practical Handbook of Software Construction*, 2nd ed. Microsoft Press, 2004.

[8] R. C. Martin, *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall, 2008.

[9] C. Larman, *Agile and Iterative Development: A Manager's Guide*. Addison-Wesley Professional, 2004.

[10] K. Schwaber and J. Sutherland, *The Scrum Guide: The Definitive Guide to Scrum*. Scrum.org, 2020.

[11] M. Fowler, *Refactoring: Improving the Design of Existing Code*. Addison-Wesley, 1999.

[12] E. Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley, 2003.

[13] S. Chacon and B. Straub, *Pro Git*, 2nd ed. Apress, 2014.

[14] ISO/IEC/IEEE 29119-1:2022, *Software and Systems Engineering — Software Testing — Part 1: Concepts and Definitions*. International Organization for Standardization.

[15] P. Ammann and J. Offutt, *Introduction to Software Testing*, 2nd ed. Cambridge University Press, 2016.

[16] J. A. Whittaker, *How to Break Software: A Practical Guide to Testing*. Addison-Wesley, 2002.

[17] M. Pezze and M. Young, *Software Testing and Analysis: Process, Principles and Techniques*. Wiley, 2008.

[18] J. Humble and D. Farley, *Continuous Delivery: Reliable Software Releases Through Build, Test, and Deployment Automation*. Addison-Wesley, 2010.

[19] I. Sommerville, *Software Engineering*, 9th ed. Addison-Wesley, 2010.

[20] B. W. Boehm, "A Spiral Model of Software Development and Enhancement," *IEEE Computer*, vol. 21, no. 5, pp. 61–72, 1988.

[21] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1994.

[22] A. Cockburn, *Crystal Clear: A Human-Powered Methodology for Small Teams*. Addison-Wesley Professional, 2004.

[23] J. Highsmith, *Adaptive Software Development: A Collaborative Approach to Managing Complex Systems*. Dorset House, 2000.

[24] J. Nielsen, *Usability Engineering*. Morgan Kaufmann Publishers, 1994.

[25] S. Krug, *Don't Make Me Think: A Common Sense Approach to Web Usability*, 3rd ed. New Riders, 2014.

[26] M. Kleppmann, *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*. O'Reilly Media, 2017.

[27] P. Abrahamsson, O. Salo, J. Ronkainen, and J. Warsta, *Agile Software Development Methods: Review and Analysis*. VTT Publications 478, VTT Technical Research Centre of Finland, 2002.
