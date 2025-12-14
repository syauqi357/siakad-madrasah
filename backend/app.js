import express from 'express';
import cors from 'cors';
import authRouter from './routes/api/auth.js';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import dotenv from 'dotenv';

// This line loads the environment variables from a .env file into process.env
dotenv.config()
const app = express();

import path from 'path'; // Import path module
app.use(cors());

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

const port = process.env.PORT;
// Enable CORS for all routes use middleware system

// middleware as reset token
// app.use()
// Parse JSON bodies
app.use(express.json());

// Serve static files from the '(public)' directory
// In ES modules, __dirname is not directly available. We construct it.
import { fileURLToPath } from 'url';
// import { getAllStudents } from './controllers/studentDatacontroller.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware statis
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/upload', express.static(path.join(__dirname, 'upload')));

// 1. Uncomment the schoolData object
//const schoolData = {
//	name: 'MTs. Persis 2 Bangil',
//	npsn: '2316989832',
	// prerequisites : harus di reload dulu server nya biar ngambil data, ini nanti di ganti sama query backend
//	logoUrl: 'upload/' // Frontend will use default logo if empty
//};

// 2. Use a more standard API route 
// - changing route using data from API for school data navbar set
app.use('/routes/api', schoolDataRouter)
app.use('/routes/api', studentDataRouter)
app.use('/api/auth', authRouter)


// Root endpoint
app.get('/', (req, res) => {
	res.send('Backend API is running!');
});

app.listen(port, () => {
	console.log(`✅ Server running at http://localhost:${port}`);
	console.log('✅ database running at:', process.env.DATABASE_URL);
});