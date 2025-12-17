import express from 'express';
import cors from 'cors';
import authRouter from './routes/api/auth.js';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import auditLogsRouter from './routes/auditLog/APILogs/audit_logs.js';
import dotenv from 'dotenv';
import path from 'path'; // Import path module

// This line loads the environment variables from a .env file into process.env
dotenv.config();
const app = express();
const FE_port = process.env.FRONTEND_URL_DEV;
// const FE_port_prod = process.env.FRONTEND_URL_;
const port = process.env.PORT;

const corsOptions = {
	origin: FE_port,
	credentials: true,
	optionsSuccessStatus: 200
};
// header line
app.use(cors(corsOptions));
// restAPI
app.use(express.json());

// --- Explanation of Environment Variables ---
//
// `process.env` vs `import.meta.env`:
//
// 1. `process.env`:
//    - This is the standard, built-in object in Node.js for accessing environment variables.
//    - It's used for BACKEND code, like in this Express server.
//    - The `dotenv.config()` call above reads your `.env` file and loads its contents
//      (e.g., PORT=5000) into this `process.env` object.
//
// 2. `import.meta.env`:
//    - This is a feature provided by the Vite build tool, which SvelteKit uses.
//    - It is used to expose environment variables to FRONTEND (client-side) code.
//    - It will NOT work in a standard Node.js backend file like this one, which is why
//      using it here caused the "Cannot read properties of undefined" error.
//
// `.PORT`:
//    - This is the specific variable we are accessing from the environment.
//    - You define this variable in your `.env` file (e.g., PORT=5000).
//    - `process.env.PORT` reads that value, which is then assigned to the `port` constant.
//

// Serve static files from the '(public)' directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware statis
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// 2. Use a more standard API route
// - changing route using data from API for school data navbar set
app.use('/routes/api', schoolDataRouter);
app.use('/routes/api', studentDataRouter);
app.use('/api/auth', authRouter);
app.use('/api/audit-logs', auditLogsRouter);

// Root endpoint
app.get('/', (req, res) => {
	res.send('Backend API is running!');
});

app.listen(port, () => {
	console.log(`✅ Server running at http://localhost:${port}`);
	console.log('✅ database running at:', process.env.DATABASE_URL);
});
