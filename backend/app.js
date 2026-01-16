import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; // MAIN DEPENDENCIES
import authRouter from './routes/api/auth.js';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import auditLogsRouter from './routes/auditLog/APILogs/audit_logs.js'; // ROUTES API
import scoreRouter from './routes/api/scores.js'; // Import scoreRouter
import { auditLog } from './middlewares/middlewareAudit.js';
import { GLOBAL_RATE_LIMIT } from './middlewares/globalRatelimit/rateLimiter.js';
import { speedLimit } from './middlewares/throttleFeat/throttleLimit.js'; // MIDDLEWARE RATE LIMIT, THROTTLE and AUDIT LOGS

// This line loads the environment variables from a .env file into process.env
dotenv.config();
const app = express();
const FE_PORT = process.env.FRONTEND_URL_DEV;
// const FE_port_prod = process.env.FRONTEND_URL_;
const PORT = process.env.PORT;

const ADDRESS = process.env.ADDRESS_SERVER;
const corsOptions = {
	origin: FE_PORT,
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


// 2. Use a more standard API route
app.use('/routes/api', speedLimit);
// - changing route using data from API for school data navbar set
app.use('/routes/api/school', schoolDataRouter);
app.use('/routes/api/student', studentDataRouter);
app.use('/api/auth', authRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/routes/api/score', scoreRouter);

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
