import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; // MAIN DEPENDENCIES
import authRouter from './routes/api/auth.js';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import auditLogsRouter from './routes/auditLog/audit_logs.js'; // ROUTES API
import rombelRouter from './routes/api/rombel.js';
import scoreRouter from './routes/api/scores.js'; // Import scoreRouter
import classDataRouter from './routes/api/classData.js'; // Import classDataRouter
import teacherRouter from './routes/api/teacher.js'; // Import teacherRouter
import assessmentTypeRouter from './routes/api/assessmentType.js'; // Import assessmentTypeRouter
import subjectRouter from './routes/api/subject.js'; // Import subjectRouter
import classSubjectRouter from './routes/api/classSubject.js'; // Import classSubjectRouter
import graduateRouter from './routes/api/graduate.js'; // Import graduateRouter
import promotionRouter from './routes/api/promotion.js'; // Import promotionRouter
import academicYearRouter from './routes/api/academicYear.js'; // Import academicYearRouter
import curriculumRouter from './routes/api/curriculum.js'; // Import curriculumRouter
import { auditLog } from './middlewares/middlewareAudit.js';
import { GLOBAL_RATE_LIMIT } from './middlewares/globalRatelimit/rateLimiter.js';
// import { speedLimit } from './middlewares/throttleFeat/throttleLimit.js'; // MIDDLEWARE RATE LIMIT, THROTTLE and AUDIT LOGS

// This line loads the environment variables from a .env file into process.env
dotenv.config();
const app = express();
// const FE_PORT = process.env.FRONTEND_URL_DEV;
// const FE_port_prod = process.env.FRONTEND_URL_;
const PORT = process.env.PORT;

const ADDRESS = process.env.ADDRESS_SERVER;
const corsOptions = {
	// origin: FE_PORT,
	credentials: true,
	optionsSuccessStatus: 200
};

// header line
app.use(cors(corsOptions));
// restAPI

app.use(express.json());

// Apply Audit Log Middleware globally
// This ensures all API requests are logged
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static middleware for upload data or images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(auditLog);
app.use(GLOBAL_RATE_LIMIT);

// Serve static files from the '(public)' directory
// Serve static files from the build directory (Svelte SPA)
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// 2. Use a more standard API route
// app.use('/routes/api', speedLimit);

// --- ROUTE CONFIGURATION ---
// 1. School Data: /routes/api/schoolData
app.use('/routes/api/schoolData', schoolDataRouter);

// 2. Student Data: /routes/api/studentDataSet... (handled inside studentDataRouter)
// Note: studentDataRouter has routes like '/studentDataSet', so we mount it at '/routes/api'
app.use('/routes/api', studentDataRouter);

// 3. Auth: /routes/api/auth/login, /routes/api/auth/logout
app.use('/routes/api/auth', authRouter);

// 4. Audit Logs: /routes/api/audit-logs
app.use('/routes/api/audit-logs', auditLogsRouter);

// 5. Scores: /routes/api/score/scorebyclass, /routes/api/score/scores
app.use('/routes/api/score', scoreRouter);

// 6. Rombel: /routes/api/rombel
app.use('/routes/api', rombelRouter);

// 7. Class Data: /routes/api/class-data
app.use('/routes/api/class-data', classDataRouter);

// 8. Teacher Data: /routes/api/teachers
app.use('/routes/api/teachers', teacherRouter);

// 9. Assessment Types: /routes/api/assessment-types
app.use('/routes/api/assessment-types', assessmentTypeRouter);

// 10. Subjects: /routes/api/subjects
app.use('/routes/api/subjects', subjectRouter);

// 11. Class-Subject Assignment: /routes/api/class-subjects
app.use('/routes/api/class-subjects', classSubjectRouter);

// 12. Graduates/Alumni: /routes/api/graduates
app.use('/routes/api/graduates', graduateRouter);

// 13. Grade Promotion: /routes/api/promotion
app.use('/routes/api/promotion', promotionRouter);

// 14. Academic Year: /routes/api/academic-years
app.use('/routes/api/academic-years', academicYearRouter);

// 15. Curriculum: /routes/api/curriculum
app.use('/routes/api/curriculum', curriculumRouter);

// For Single Page Applications (SPAs) with client-side routing,
// serve index.html for all non-API routes
app.get('{*splat}', (req, res) => {
	res.sendFile(path.join(buildPath, 'index.html'));
});

// Root endpoint
app.get('/', (req, res) => {
	res.send(`Backend Express API is running on port : ${PORT}`);
});

app.listen(PORT, () => {
	console.log(`✅ Server running at ${ADDRESS}:${PORT}`);
	console.log('✅ database running at:', process.env.DATABASE_URL);
	// 	jwt secret check
	// 	console.log('✅ jwt secret:', process.env.JWT_SECRET);
});

/**
 *
 * # 1. Install new dependencies
 *   npm install
 *
 *   # 2. Rebuild native modules for Electron
 *   npm run electron:rebuild
 *
 *   # 3. Test in development mode
 *   npm run electron:dev
 *
 *   If step 2 fails, you may need to install build tools:
 *
 *   # Windows - run as Administrator
 *   npm install -g windows-build-tools
 *
 *   # Or install Visual Studio Build Tools manually
 *
 *   To Build Distributable
 *
 *   # Build Windows installer + portable
 *   npm run electron:build:win
 *
 *   # Or just portable version
 *   npm run electron:build:portable
 *
 *   Output will be in dist-electron/ folder.
 *
 * */
