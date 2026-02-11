import { registerRombel, getAllRombels, getRombelById, deleteRombelById, addStudentsToRombel } from '../services/rombel.services.js';

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

		const result = registerRombel(payload);

		if (result.error === 'CAPACITY_EXCEEDED') {
			return res.status(400).json({
				success: false,
				message: `Jumlah siswa (${result.studentCount}) melebihi kapasitas rombel (${result.capacity}).`
			});
		}

		if (result.error === 'INVALID_CAPACITY') {
			return res.status(400).json({
				success: false,
				message: 'Kapasitas siswa harus lebih dari 0.'
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Rombel registered successfully'
		});
	} catch (error) {
		console.error('Error in createRombel controller:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error'
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

		const result = deleteRombelById(rombelId);

		if (!result) {
			return res.status(404).json({
				success: false,
				message: 'Rombel not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Rombel deleted successfully'
		});
	} catch (error) {
		console.error('Error in deleteRombel controller:', error);
		res.status(500).json({
			success: false,
			message: 'Internal Server Error'
		});
	}
};

/**
 * Controller to add students to an existing rombel.
 */
export const addStudentsToExistingRombel = (req, res) => {
	try {
		const rombelId = parseInt(req.params.id);

		if (isNaN(rombelId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid rombel ID'
			});
		}

		const { studentIds } = req.body;

		if (!Array.isArray(studentIds) || studentIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'studentIds must be a non-empty array'
			});
		}

		const result = addStudentsToRombel(rombelId, studentIds);

		if (!result) {
			return res.status(404).json({
				success: false,
				message: 'Rombel not found'
			});
		}

		if (result.error === 'CAPACITY_EXCEEDED') {
			return res.status(400).json({
				success: false,
				message: `Kapasitas tidak cukup. Tersisa ${result.available} slot, mencoba menambah ${result.requested} siswa.`
			});
		}

		res.status(200).json({
			success: true,
			message: `${result.added} siswa berhasil ditambahkan`,
			data: result
		});
	} catch (error) {
		console.error('Error in addStudentsToExistingRombel controller:', error);
		res.status(500).json({
			success: false,
			message: 'Internal Server Error'
		});
	}
};
