import { registerRombel } from '../services/rombel.services.js';

/**
 * Controller to handle the creation of a new Rombel (Class Group).
 * Expects a JSON payload in the request body with the structure:
 * [
 *   {
 *     "tahun_ajaran": "2025/2026 Genap",
 *     "tingkat_kelas": "10",
 *     "nama_rombel": "X-IPA-1",
 *     "wali_kelas": "12345",
 *     "nama_ruangan": "R01",
 *     "kurikulum": "Kurikulum Merdeka",
 *     "jenis_rombel": "kelas",
 *     "siswa": [1, 2, 3, 4, 5]
 *   }
 * ]
 */
export const createRombel = async (req, res) => {
	try {
		const payload = req.body;

		// Basic validation to ensure payload is an array
		if (!Array.isArray(payload) || payload.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid payload format. Expected a non-empty array of rombel data.'
			});
		}

		const result = await registerRombel(payload);

		return res.status(201).json({
			success: true,
			message: result.message
		});
	} catch (error) {
		console.error('Error in createRombel controller:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
			error: error.message
		});
	}
};
