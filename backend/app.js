import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'; // main dependencies
import authRouter from './routes/api/auth.js';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import auditLogsRouter from './routes/auditLog/APILogs/audit_logs.js'; // routes
import { auditLog } from './middlewares/middlewareAudit.js'; // middleware audit logs
import { GlobalRatelimit } from './middlewares/globalRatelimit/rateLimiter.js';
import { speedLimit } from './middlewares/throttleFeat/throttleLimit.js'; // rate limit and throttle

// This line loads the environment variables from a .env file into process.env
dotenv.config();
const app = express();
const FE_port = process.env.FRONTEND_URL_DEV;
// const FE_port_prod = process.env.FRONTEND_URL_;
const PORT = process.env.PORT;

const address = process.env.ADDRESS_SERVER;
const corsOptions = {
	origin: FE_port,
	credentials: true,
	optionsSuccessStatus: 200
};

// header line
app.use(cors(corsOptions));
// restAPI

app.use(express.json());
app.use(GlobalRatelimit);
// Apply Audit Log Middleware globally
// This ensures all API requests are logged

app.use(auditLog);
// Serve static files from the '(public)' directory
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static middleware for upload data or images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// 2. Use a more standard API route
app.use('/routes/api', speedLimit);
// - changing route using data from API for school data navbar set
app.use('/routes/api', schoolDataRouter);
app.use('/routes/api', studentDataRouter);
app.use('/api/auth', authRouter);
app.use('/api/audit-logs', auditLogsRouter);

// Root endpoint
app.get('/', (req, res) => {
	res.send(`Backend Express API is running on port : ${PORT}`);
});

app.listen(PORT, () => {
	console.log(`✅ Server running at ${address}:${PORT}`);
	console.log('✅ database running at:', process.env.DATABASE_URL);
	// 	jwt secret check
	// 	console.log('✅ jwt secret:', process.env.JWT_SECRET);
});
