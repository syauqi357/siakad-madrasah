# Project Context & AI Instructions

## 1. Overview

- **Frontend:** SvelteKit, TailwindCSS
- **Backend:** Express.js, Drizzle ORM, ExcelJS, Jest (Unit Testing)

## 2. Architecture

_Note: Separate the architecture strictly between Frontend and Backend._

- **Frontend Architecture:**

```
siakad-madrasah
├─ .npmrc
├─ .prettierignore
├─ .prettierrc
├─ API_DOCUMENTATION.md
├─ API_JSON_PAYLOAD.md
├─ CLASS_DIAGRAM_PLANTUML.md
├─ docs
│  ├─ 01-ARCHITECTURE.md
│  ├─ 02-DATABASE.md
│  ├─ 03-API.md
│  ├─ 04-COMPONENTS.md
│  ├─ 05-FEATURES.md
│  ├─ 06-DEVELOPMENT.md
│  ├─ database_schema.sql
│  └─ _archive
│     ├─ academicyeardocs.md
│     ├─ assesmentdocs.md
│     ├─ assesmentservicedocs.md
│     ├─ classdatadocumentation.md
│     ├─ claudeOpusexec.md
│     ├─ dokumentasi.md
│     ├─ drizzle_explain.md
│     ├─ excelbulkInputplan.md
│     ├─ fontstyle.md
│     ├─ functions.md
│     ├─ inputboxwhy.md
│     ├─ modal.md
│     ├─ modalpopupalert.md
│     ├─ numberinputonly.md
│     ├─ refactoredschoolcontroller.md
│     ├─ rombelfeat.md
│     ├─ scoresdocs.md
│     ├─ studentdatadocs.md
│     ├─ studentexcel.md
│     ├─ studentfilterservice.md
│     ├─ studentsdata.md
│     ├─ testscore.md
│     ├─ TODO.md
│     ├─ translations_table.md
│     ├─ whyhardcodedtable.md
│     └─ whynotputpatchHTTP.md
├─ eslint.config.js
├─ GEMINI.md
├─ package.json
├─ pnpm-workspace.yaml
├─ README.md
├─ src
│  ├─ app.css
│  ├─ app.d.ts
│  ├─ app.html
│  ├─ lib
│  │  ├─ api.ts
│  │  ├─ assets
│  │  │  ├─ favicon.svg
│  │  │  └─ siakadLogo.svg
│  │  ├─ components
│  │  │  ├─ features
│  │  │  │  ├─ audit
│  │  │  │  │  ├─ AuditFilters.svelte
│  │  │  │  │  ├─ AuditLogs.svelte
│  │  │  │  │  └─ AuditTable.svelte
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ Calendar.svelte
│  │  │  │  │  ├─ DashboardLandsort.svelte
│  │  │  │  │  ├─ NavigationCards.svelte
│  │  │  │  │  ├─ SchoolProperties.svelte
│  │  │  │  │  └─ StatCard.svelte
│  │  │  │  ├─ navigation
│  │  │  │  │  └─ NavigationScreen.svelte
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ ChangePassword.svelte
│  │  │  │  │  ├─ ChangeUsername.svelte
│  │  │  │  │  └─ PassIndicatorStrength.svelte
│  │  │  │  ├─ scores
│  │  │  │  │  └─ StudentScoreTable.svelte
│  │  │  │  ├─ student
│  │  │  │  │  └─ ParentBiodata.svelte
│  │  │  │  └─ upload
│  │  │  │     └─ UploadExcel.svelte
│  │  │  ├─ icons
│  │  │  │  ├─ addIcon.svelte
│  │  │  │  ├─ arrow_left.svelte
│  │  │  │  ├─ arrow_up.svelte
│  │  │  │  ├─ checkIcon.svelte
│  │  │  │  ├─ crossIcon.svelte
│  │  │  │  ├─ DashboardIcon.svelte
│  │  │  │  ├─ deleteIcon.svelte
│  │  │  │  ├─ downloadIcon.svelte
│  │  │  │  ├─ editIcon.svelte
│  │  │  │  ├─ errorIcon.svelte
│  │  │  │  ├─ EyeIcon.svelte
│  │  │  │  ├─ graduateIcon.svelte
│  │  │  │  ├─ more.svelte
│  │  │  │  ├─ mutationIcon.svelte
│  │  │  │  ├─ sort.svelte
│  │  │  │  ├─ success.svelte
│  │  │  │  ├─ uploadIcon.svelte
│  │  │  │  └─ warningIcon.svelte
│  │  │  ├─ input
│  │  │  │  ├─ inputMapel.svelte
│  │  │  │  └─ PhoneInput.svelte
│  │  │  ├─ layout
│  │  │  │  ├─ Navbar.svelte
│  │  │  │  └─ Sidebar.svelte
│  │  │  ├─ modal
│  │  │  │  ├─ GraduateModal.svelte
│  │  │  │  ├─ modalalert.svelte
│  │  │  │  ├─ modalexam.svelte
│  │  │  │  ├─ MutasiModal.svelte
│  │  │  │  ├─ RombelAddStudentPanel.svelte
│  │  │  │  ├─ RombelEditModal.svelte
│  │  │  │  └─ SubjectSelectModal.svelte
│  │  │  └─ ui
│  │  │     └─ PendingScreen.svelte
│  │  ├─ config
│  │  │  ├─ navigation.ts
│  │  │  └─ navigation_short.ts
│  │  ├─ data
│  │  │  ├─ countryCodes.ts
│  │  │  └─ navigationCategories.ts
│  │  ├─ fonts
│  │  │  ├─ inter-font
│  │  │  │  ├─ Inter-Black.woff2
│  │  │  │  ├─ Inter-BlackItalic.woff2
│  │  │  │  ├─ Inter-Bold.woff2
│  │  │  │  ├─ Inter-BoldItalic.woff2
│  │  │  │  ├─ Inter-ExtraBold.woff2
│  │  │  │  ├─ Inter-ExtraBoldItalic.woff2
│  │  │  │  ├─ Inter-ExtraLight.woff2
│  │  │  │  ├─ Inter-ExtraLightItalic.woff2
│  │  │  │  ├─ Inter-Italic.woff2
│  │  │  │  ├─ Inter-Light.woff2
│  │  │  │  ├─ Inter-LightItalic.woff2
│  │  │  │  ├─ Inter-Medium.woff2
│  │  │  │  ├─ Inter-MediumItalic.woff2
│  │  │  │  ├─ Inter-Regular.woff2
│  │  │  │  ├─ Inter-SemiBold.woff2
│  │  │  │  ├─ Inter-SemiBoldItalic.woff2
│  │  │  │  ├─ Inter-Thin.woff2
│  │  │  │  ├─ Inter-ThinItalic.woff2
│  │  │  │  ├─ InterDisplay-Black.woff2
│  │  │  │  ├─ InterDisplay-BlackItalic.woff2
│  │  │  │  ├─ InterDisplay-Bold.woff2
│  │  │  │  ├─ InterDisplay-BoldItalic.woff2
│  │  │  │  ├─ InterDisplay-ExtraBold.woff2
│  │  │  │  ├─ InterDisplay-ExtraBoldItalic.woff2
│  │  │  │  ├─ InterDisplay-ExtraLight.woff2
│  │  │  │  ├─ InterDisplay-ExtraLightItalic.woff2
│  │  │  │  ├─ InterDisplay-Italic.woff2
│  │  │  │  ├─ InterDisplay-Light.woff2
│  │  │  │  ├─ InterDisplay-LightItalic.woff2
│  │  │  │  ├─ InterDisplay-Medium.woff2
│  │  │  │  ├─ InterDisplay-MediumItalic.woff2
│  │  │  │  ├─ InterDisplay-Regular.woff2
│  │  │  │  ├─ InterDisplay-SemiBold.woff2
│  │  │  │  ├─ InterDisplay-SemiBoldItalic.woff2
│  │  │  │  ├─ InterDisplay-Thin.woff2
│  │  │  │  ├─ InterDisplay-ThinItalic.woff2
│  │  │  │  ├─ InterVariable-Italic.woff2
│  │  │  │  ├─ InterVariable.ttf
│  │  │  │  └─ InterVariable.woff2
│  │  │  ├─ monospace_fonts
│  │  │  │  ├─ JetBrainsMono-Bold.woff2
│  │  │  │  ├─ JetBrainsMono-BoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraBold.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraBoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraLight.woff2
│  │  │  │  ├─ JetBrainsMono-ExtraLightItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Italic.woff2
│  │  │  │  ├─ JetBrainsMono-Light.woff2
│  │  │  │  ├─ JetBrainsMono-LightItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Medium.woff2
│  │  │  │  ├─ JetBrainsMono-MediumItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Regular.woff2
│  │  │  │  ├─ JetBrainsMono-SemiBold.woff2
│  │  │  │  ├─ JetBrainsMono-SemiBoldItalic.woff2
│  │  │  │  ├─ JetBrainsMono-Thin.woff2
│  │  │  │  └─ JetBrainsMono-ThinItalic.woff2
│  │  │  └─ StackSans-fonts
│  │  │     ├─ StackSansText-Bold.woff2
│  │  │     ├─ StackSansText-ExtraLight.woff2
│  │  │     ├─ StackSansText-Light.woff2
│  │  │     ├─ StackSansText-Medium.woff2
│  │  │     ├─ StackSansText-Regular.woff2
│  │  │     └─ StackSansText-SemiBold.woff2
│  │  ├─ image
│  │  │  ├─ pattern-randomized.svg
│  │  │  └─ topography.svg
│  │  ├─ index.ts
│  │  ├─ services
│  │  │  └─ auditService.ts
│  │  ├─ stores.ts
│  │  └─ types
│  │     └─ navigation.ts
│  └─ routes
│     ├─ (app)
│     │  ├─ +layout.svelte
│     │  ├─ admin
│     │  │  └─ profile
│     │  │     └─ +page.svelte
│     │  ├─ confirm
│     │  │  ├─ lembaga
│     │  │  │  └─ +page.svelte
│     │  │  ├─ sarpras
│     │  │  │  └─ +page.svelte
│     │  │  ├─ studentdata
│     │  │  │  └─ +page.svelte
│     │  │  └─ teacher
│     │  │     └─ +page.svelte
│     │  ├─ dashboard
│     │  │  └─ +page.svelte
│     │  ├─ Documentations
│     │  │  ├─ +page.server.ts
│     │  │  └─ +page.svelte
│     │  ├─ gurutendik
│     │  │  ├─ ajuan-gtk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ akun
│     │  │  │  └─ +page.svelte
│     │  │  ├─ daftar-gtk
│     │  │  │  └─ +page.svelte
│     │  │  └─ mutasi
│     │  │     └─ +page.svelte
│     │  ├─ info
│     │  │  ├─ academicyear
│     │  │  │  └─ +page.svelte
│     │  │  ├─ curriculum
│     │  │  │  └─ +page.svelte
│     │  │  └─ daysch
│     │  │     └─ +page.svelte
│     │  ├─ lembaga
│     │  │  └─ +page.svelte
│     │  ├─ rombel
│     │  │  ├─ +page.svelte
│     │  │  ├─ addrombel
│     │  │  │  └─ +page.svelte
│     │  │  └─ detailrombel
│     │  │     └─ [id]
│     │  │        └─ +page.svelte
│     │  ├─ sarpras
│     │  │  ├─ asetlancar
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  ├─ assettetap
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  └─ perpustakaan
│     │  │     ├─ +page.svelte
│     │  │     └─ [id]
│     │  │        └─ +page.svelte
│     │  ├─ score
│     │  │  ├─ +page.svelte
│     │  │  ├─ exam
│     │  │  │  └─ +page.svelte
│     │  │  ├─ exammanagement
│     │  │  │  └─ +page.svelte
│     │  │  ├─ subject
│     │  │  │  └─ +page.svelte
│     │  │  ├─ task
│     │  │  │  └─ +page.svelte
│     │  │  └─ upgrade
│     │  │     └─ +page.svelte
│     │  ├─ siswa
│     │  │  ├─ +page.svelte
│     │  │  ├─ addStudent
│     │  │  │  └─ +page.svelte
│     │  │  ├─ alumni
│     │  │  │  ├─ +page.svelte
│     │  │  │  └─ [id]
│     │  │  │     └─ +page.svelte
│     │  │  ├─ beasiswa
│     │  │  │  └─ +page.svelte
│     │  │  ├─ graduate-bulk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ Kelas
│     │  │  │  └─ +page.svelte
│     │  │  ├─ mutasi
│     │  │  │  └─ +page.svelte
│     │  │  ├─ mutasi-masuk
│     │  │  │  └─ +page.svelte
│     │  │  ├─ siswa-ganda
│     │  │  │  └─ +page.svelte
│     │  │  └─ [id]
│     │  │     ├─ +page.svelte
│     │  │     └─ edit
│     │  │        └─ +page.svelte
│     │  └─ support
│     │     └─ +page.svelte
│     ├─ (public)
│     │  └─ login
│     │     └─ +page.svelte
│     ├─ +error.svelte
│     ├─ +layout.svelte
│     └─ +page.svelte
├─ static
│  ├─ favicon.svg
│  └─ robots.txt
├─ svelte.config.js
├─ tsconfig.json
└─ vite.config.ts
```

- **Backend Architecture:**

```
├─ backend
│  ├─ afterPack.cjs
│  ├─ app.js
│  ├─ BACKEND_README.md
│  ├─ drizzle
│  │  ├─ 0000_tense_celestials.sql
│  │  ├─ 0001_dark_puff_adder.sql
│  │  ├─ 0002_wooden_galactus.sql
│  │  ├─ 0003_exotic_wallflower.sql
│  │  ├─ 0004_outgoing_vindicator.sql
│  │  ├─ 0005_next_carmella_unuscione.sql
│  │  ├─ 0006_ambiguous_hobgoblin.sql
│  │  ├─ 0007_optimal_stone_men.sql
│  │  ├─ 0008_overconfident_santa_claus.sql
│  │  ├─ 0009_wide_sharon_ventura.sql
│  │  ├─ 0010_fluffy_preak.sql
│  │  └─ meta
│  │     ├─ 0000_snapshot.json
│  │     ├─ 0001_snapshot.json
│  │     ├─ 0002_snapshot.json
│  │     ├─ 0003_snapshot.json
│  │     ├─ 0004_snapshot.json
│  │     ├─ 0005_snapshot.json
│  │     ├─ 0006_snapshot.json
│  │     ├─ 0007_snapshot.json
│  │     ├─ 0008_snapshot.json
│  │     ├─ 0009_snapshot.json
│  │     ├─ 0010_snapshot.json
│  │     └─ _journal.json
│  ├─ drizzle.config.js
│  ├─ electron
│  │  ├─ main.js
│  │  └─ preload.cjs
│  ├─ electron-builder.json
│  ├─ jest.config.js
│  ├─ package.json
│  ├─ public
│  │  └─ upload
│  │     ├─ imageSch
│  │     │  ├─ aset
│  │     │  ├─ asrama
│  │     │  ├─ canteen
│  │     │  │  ├─ 2212559803.webp
│  │     │  │  └─ kantin-1024x767-1.jpg
│  │     │  ├─ certification
│  │     │  ├─ gedung
│  │     │  ├─ kamar_mandi
│  │     │  ├─ kantor
│  │     │  ├─ kelas
│  │     │  ├─ lab
│  │     │  │  ├─ lab_Ipa
│  │     │  │  ├─ lab_komputer
│  │     │  │  │  └─ images.webp
│  │     │  │  └─ lab_multimedia
│  │     │  ├─ lapangan
│  │     │  ├─ masjid
│  │     │  └─ parking_lot
│  │     ├─ Profile
│  │     │  ├─ accountAdminProfile
│  │     │  ├─ studentProfile
│  │     │  │  └─ student_1_1779957637926.png
│  │     │  └─ teacherProfile
│  │     └─ profilesch
│  │        ├─ logo.jpg
│  │        └─ logo.png
│  └─ src
│     ├─ controllers
│     │  ├─ academicYearController.js
│     │  ├─ assessmentController.js
│     │  ├─ authController.js
│     │  ├─ classdataController.js
│     │  ├─ classSubjectController.js
│     │  ├─ curriculumController.js
│     │  ├─ graduateController.js
│     │  ├─ promotionController.js
│     │  ├─ rombelController.js
│     │  ├─ schoolController.js
│     │  ├─ scoreController.js
│     │  ├─ studentController.js
│     │  ├─ subjectController.js
│     │  └─ teacherController.js
│     ├─ db
│     │  ├─ index.js
│     │  ├─ schema
│     │  │  ├─ academicYear.js
│     │  │  ├─ assesmentType.js
│     │  │  ├─ auditlog.js
│     │  │  ├─ classesDataTable.js
│     │  │  ├─ classesSubjectTable.js
│     │  │  ├─ classGroup.js
│     │  │  ├─ classSchoolData
│     │  │  ├─ curriculum.js
│     │  │  ├─ relations.js
│     │  │  ├─ rombelStudents.js
│     │  │  ├─ schoolAddress.js
│     │  │  ├─ schooldataTable.js
│     │  │  ├─ schoolFacilities.js
│     │  │  ├─ scoreStudentData
│     │  │  ├─ studentActivestatus.js
│     │  │  ├─ studentAddress.js
│     │  │  ├─ studentAttendance.js
│     │  │  ├─ studentClass.js
│     │  │  ├─ studentFather.js
│     │  │  ├─ studentHistory.js
│     │  │  ├─ studentMother.js
│     │  │  ├─ studentScore.js
│     │  │  ├─ studentsdataTable.js
│     │  │  ├─ studentWali.js
│     │  │  ├─ subjectTable.js
│     │  │  ├─ teacherUser.js
│     │  │  └─ user.js
│     │  ├─ seed.js
│     │  ├─ seedManager.js
│     │  └─ seedscore.js
│     ├─ middlewares
│     │  ├─ globalRatelimit
│     │  │  └─ rateLimiter.js
│     │  ├─ middlewareAudit.js
│     │  ├─ throttleFeat
│     │  │  └─ throttleLimit.js
│     │  └─ verifyToken.js
│     ├─ public
│     │  └─ upload
│     │     └─ profilesch
│     │        └─ logo.png
│     ├─ routes
│     │  ├─ api
│     │  │  ├─ academicYear.js
│     │  │  ├─ assessmentType.js
│     │  │  ├─ auth.js
│     │  │  ├─ classData.js
│     │  │  ├─ classSubject.js
│     │  │  ├─ curriculum.js
│     │  │  ├─ graduate.js
│     │  │  ├─ promotion.js
│     │  │  ├─ rombel.js
│     │  │  ├─ schooldataNav.js
│     │  │  ├─ scores.js
│     │  │  ├─ student.js
│     │  │  ├─ subject.js
│     │  │  └─ teacher.js
│     │  └─ auditLog
│     │     └─ audit_logs.js
│     ├─ services
│     │  ├─ academicYear.services.js
│     │  ├─ assesment.services.js
│     │  ├─ auth.service.js
│     │  ├─ classData.services.js
│     │  ├─ classSubject.service.js
│     │  ├─ curriculum.services.js
│     │  ├─ graduate.services.js
│     │  ├─ promotion.services.js
│     │  ├─ rombel.services.js
│     │  ├─ schoolData.service.js
│     │  ├─ score.services.js
│     │  ├─ student.service.js
│     │  ├─ subject.services.js
│     │  └─ teacher.services.js
│     └─ utils
│        ├─ passwordGenerator
│        │  └─ bcrypt.js
│        ├─ seedFile
│        │  ├─ seed.js
│        │  ├─ seedAcademicCore.js
│        │  ├─ seedAcademicYear.js
│        │  ├─ seedAuth.js
│        │  ├─ seedClasses.js
│        │  ├─ seedClassesAuto.js
│        │  ├─ seedFresh.js
│        │  ├─ seedMapelKurikulum.js
│        │  ├─ seedRombelSync.js
│        │  ├─ seedSchool.js
│        │  ├─ seedStudentFull.js
│        │  ├─ seedStudentPerformance.js
│        │  ├─ seedSyncAcademic.js
│        │  └─ seedTeacher.js
│        └─ unit_test
│           ├─ rombel.services.test.js
│           ├─ score.services.test.js
│           ├─ student.bulk_upload.test.js
│           └─ student.payload.test.js
```

## 3. Coding Style & Conventions (Syntax Formatting)

- **Component Model:** Use a strict component-based architecture.
- **Global Variables:** Use `CAPITAL_CASE` for all global constants and variables.
- **Private/Local Variables:** Use `camelCase` for private variables or single-file scopes (especially to handle internal circular dependencies).

## 4. Best Practices

- **Reusability:** Build highly reusable modular components.
- **Efficiency:** Strictly avoid unnecessary boilerplate. Apply the YAGNI (You Ain't Gonna Need It) principle to keep the codebase lean.

## 5. Design & Engineering Principles

- **Minimalism & Usability:** Focus on minimalist design and a highly usable interface.
- **User Experience:** Ensure low cognitive load for the user, aligning with Steve Krug's intuitive usability concepts ("Don't make me think").

## 6. Strict Rules (DOs and DONTs)

### DO:

- Create simple, intuitive designs that prioritize low cognitive load.
- Follow this strict border-radius hierarchy for UI elements:
  - Outer containers: `rounded-md`
  - Inner elements (1st level inside outer): `rounded-sm`
  - Innermost elements (1 step inside inner): `rounded-xs`

### DONT:

- DO NOT suggest or implement bad, overly complex, or convoluted ideas.
- DO NOT create generic, uninspired, or boring frontend designs.
- DO NOT introduce or install any new external libraries. You must strictly use the existing libraries defined in the tech stack.
