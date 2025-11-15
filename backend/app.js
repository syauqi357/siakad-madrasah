import express from 'express';
import cors from 'cors';
import path from 'path'; // Import path module

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
// In ES modules, __dirname is not directly available. We construct it.
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// School data
const schoolData = {
	name: 'MTs. Persis 2 Bangil',
	npsn: '2316989832',
    // 231698134 <- number before
    // 2316989832 <- number after 
    // prerequisites : harus di reload dulu server nya biar ngambil data ii nanti di ganti sama query backend
	logoUrl: 'upload/logo.svg' // Frontend will use default logo if empty
};

// API endpoint for school data
app.get('/schoolData', (req, res) => {
	res.json(schoolData);
});

// Root endpoint
app.get('/', (req, res) => {
	res.send('Backend API is running!');
});

app.listen(port, () => {
	console.log(`✅ Server running at http://localhost:${port}`);
});