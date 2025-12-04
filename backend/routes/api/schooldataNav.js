import express from 'express';
const router = express.Router();

// School data
const schoolData = {
	name: 'MTs. PERSIS 1 BANGIL',
	npsn: '63747632892636',
    nsm: '73210987219',
    akreditasi: 'B',
    alamat:'jalan kh abdul rahman wahid no.3 gang. 7',
    negara:'indonesia',
    // 231698134 <- number before
    // 2316989832 <- number after
     // 23169874273289 <- number after changes and replacement
    // prerequisites : harus di reload dulu server nya biar ngambil data, ini nanti di ganti sama query backend
	logoUrl: 'upload/' // Frontend will use default logo if empty
};

router.get('/schoolData', (req, res) => {
	res.json(schoolData);
});

export default router;