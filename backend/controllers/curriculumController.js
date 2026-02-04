import * as curriculumService from '../services/curriculum.services.js';

/**
 * GET /curriculum - Get all curricula
 */
export const getAll = (req, res) => {
	try {
		const curricula = curriculumService.getAllCurricula();
		res.json({ success: true, data: curricula });
	} catch (error) {
		console.error('Error getting curricula:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /curriculum/lite - Get curricula for dropdown
 */
export const getLite = (req, res) => {
	try {
		const curricula = curriculumService.getCurriculaLite();
		res.json({ success: true, data: curricula });
	} catch (error) {
		console.error('Error getting curricula lite:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /curriculum/active - Get active curriculum
 */
export const getActive = (req, res) => {
	try {
		const curr = curriculumService.getActiveCurriculum();
		if (!curr) {
			return res.status(404).json({ success: false, message: 'Tidak ada kurikulum aktif' });
		}
		res.json({ success: true, data: curr });
	} catch (error) {
		console.error('Error getting active curriculum:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /curriculum/:id - Get single curriculum
 */
export const getById = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const curr = curriculumService.getCurriculumById(id);

		if (!curr) {
			return res.status(404).json({ success: false, message: 'Kurikulum tidak ditemukan' });
		}

		res.json({ success: true, data: curr });
	} catch (error) {
		console.error('Error getting curriculum:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * POST /curriculum - Create new curriculum
 */
export const create = (req, res) => {
	try {
		const { name, code, year, description, isActive } = req.body;

		if (!name || !code || !year) {
			return res.status(400).json({ success: false, message: 'Nama, kode, dan tahun wajib diisi' });
		}

		const created = curriculumService.createCurriculum({
			name,
			code,
			year,
			description,
			isActive
		});

		res.status(201).json({ success: true, message: 'Kurikulum berhasil dibuat', data: created });
	} catch (error) {
		console.error('Error creating curriculum:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * PUT /curriculum/:id - Update curriculum
 */
export const update = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const updated = curriculumService.updateCurriculum(id, req.body);
		res.json({ success: true, message: 'Kurikulum berhasil diupdate', data: updated });
	} catch (error) {
		console.error('Error updating curriculum:', error);
		const status = error.message.includes('tidak ditemukan') ? 404 : 500;
		res.status(status).json({ success: false, message: error.message });
	}
};

/**
 * DELETE /curriculum/:id - Delete curriculum
 */
export const remove = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		curriculumService.deleteCurriculum(id);
		res.json({ success: true, message: 'Kurikulum berhasil dihapus' });
	} catch (error) {
		console.error('Error deleting curriculum:', error);
		const status = error.message.includes('tidak ditemukan') ? 404 : 500;
		res.status(status).json({ success: false, message: error.message });
	}
};
