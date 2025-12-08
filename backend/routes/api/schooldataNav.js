import express from 'express';
import { url } from 'inspector';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
import schoolData from './data/lembaga.json'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find logo file in upload directory
function findLogoFile() {
	const uploadPath = path.join(__dirname, '../../public/upload');

	try {
		const files = fs.readdirSync(uploadPath);
		// Find first image file (png, jpg, svg, etc.)
		const logoFile = files.find((file) => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(file));

		return logoFile ? `upload/${logoFile}` : '';
	} catch (error) {
		console.error('Error reading upload directory:', error);
		return '';
	}
}

// School data
const schoolData = {
	name: 'MTs. PERSIS 1 BANGIL',
	npsn: '63747632892636',
	nsm: '73210987219',
	akreditasi: 'B',
	alamat: 'jalan kh abdul rahman wahid no.3 gang. 7',
	negara: 'indonesia',
	// 231698134 <- number before
	// 2316989832 <- number after
	// 23169874273289 <- number after changes and replacement
	// prerequisites : harus di reload dulu server nya biar ngambil data, ini nanti di ganti sama query backend
	logoUrl: findLogoFile() // Frontend will use default logo if empty
};

router.get('/schoolData', (req, res) => {
	const currentData = {
		...schoolData,
		logoUrl: findLogoFile()
	};
	res.json(schoolData);
});

export default router;
