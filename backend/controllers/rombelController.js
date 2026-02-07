import { registerRombel, getAllRombels, getRombelById, deleteRombelById } from '../services/rombel.services.js';

/**
 * Controller to handle the creation of a new Rombel (Class Group).
 */
export const createRombel = async (req, res) => {
	try {
		const payload = req.body;

		if (!Array.isArray(payload) || payload.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid payload format. Expected a non-empty array of rombel data.'
			});
		}

		const result = registerRombel(payload); // Synchronous call now

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

/**
 * Controller to get the list of all rombels.
 */
export const getRombelList = (req, res) => {
	try {
		const result = getAllRombels();
		res.status(200).json({
			success: true,
			data: result
		});
	} catch (error) {
		console.error('Error in getRombelList controller:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch rombel list',
			error: error.message
		});
	}
};

/**
 * Controller to get a single rombel by ID with its students.
 */
export const getRombelDetail = (req, res) => {
	try {
		const rombelId = parseInt(req.params.id);

		if (isNaN(rombelId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid rombel ID'
			});
		}

		const result = getRombelById(rombelId);

		if (!result) {
			return res.status(404).json({
				success: false,
				message: 'Rombel not found'
			});
		}

		res.status(200).json({
			success: true,
			data: result
		});
	} catch (error) {
		console.error('Error in getRombelDetail controller:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch rombel detail',
			error: error.message
		});
	}
};

/**
 * Controller to delete a rombel by ID.
 */
export const deleteRombel = (req, res) => {
	try {
		const rombelId = parseInt(req.params.id);

		if (isNaN(rombelId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid rombel ID'
			});
		}

		deleteRombelById(rombelId);

		res.status(200).json({
			success: true,
			message: 'Rombel deleted successfully'
		});
	} catch (error) {
		console.error('Error in deleteRombel controller:', error);
		const status = error.message === 'Rombel not found' ? 404 : 500;
		res.status(status).json({
			success: false,
			message: error.message
		});
	}
};
