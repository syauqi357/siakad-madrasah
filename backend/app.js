import express from 'express';
import cors from 'cors';
import schoolDataRouter from './routes/api/schooldataNav.js';
import studentDataRouter from './routes/api/student.js';
import authRouter from './routes/api/auth.js';

import path from 'path'; // Import path module

const app = express();
const port = 3000;

// Enable CORS for all routes use middleware system
app.use(cors());

// middleware as reset token
// app.use()

// Parse JSON bodies
app.use(express.json());

// Serve static files from the '(public)' directory
// In ES modules, __dirname is not directly available. We construct it.
import { fileURLToPath } from 'url';
import { getAllStudents } from './controllers/studentDatacontroller.js';
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
});