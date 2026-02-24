import * as assessmentService from '../services/assesment.services.js';

/**
 * GET /api/assessment-types
 * Get all assessment types with pagination
 */
export const getAllAssessmentTypes = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const activeOnly = req.query.activeOnly === 'true';

		const types = await assessmentService.getAllAssessmentTypes(page, limit, activeOnly);
		const totalCount = await assessmentService.countAssessmentTypes(activeOnly);

		res.status(200).json({
			data: types,
			pagination: {
				total: totalCount.count,
				page,
				limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Error fetching assessment types:', error);
		res.status(500).json({ message: 'Error fetching assessment types', error: error.message });
	}
};

/**
 * GET /api/assessment-types/lite
 * Get active assessment types for dropdown
 */
export const getAssessmentTypesLite = async (req, res) => {
	try {
		const types = await assessmentService.getAssessmentTypesLite();
		res.status(200).json(types);
	} catch (error) {
		console.error('Error fetching assessment types:', error);
		res.status(500).json({ message: 'Error fetching assessment types', error: error.message });
	}
};

/**
 * GET /api/assessment-types/stats
 * Get assessment type statistics
 */
export const getAssessmentTypeStats = async (req, res) => {
	try {
		const stats = await assessmentService.getAssessmentTypeStats();
		res.status(200).json(stats);
	} catch (error) {
		console.error('Error fetching assessment stats:', error);
		res.status(500).json({ message: 'Error fetching stats', error: error.message });
	}
};

/**
 * GET /api/assessment-types/:id
 * Get assessment type by ID
 */
export const getAssessmentTypeById = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const type = await assessmentService.getAssessmentTypeById(id);

		if (!type) {
			return res.status(404).json({ message: 'Jenis penilaian tidak ditemukan' });
		}

		res.status(200).json(type);
	} catch (error) {
		console.error('Error fetching assessment type:', error);
		res.status(500).json({ message: 'Error fetching assessment type', error: error.message });
	}
};

/**
 * POST /api/assessment-types
 * Create new assessment type
 */
export const createAssessmentType = async (req, res) => {
	try {
		const { code, name } = req.body;

		if (!code || !name) {
			return res.status(400).json({ message: 'Kode dan nama penilaian wajib diisi' });
		}

		// Check if code already exists
		const existing = await assessmentService.getAssessmentTypeByCode(code);
		if (existing) {
			return res.status(400).json({ message: `Kode penilaian "${code}" sudah digunakan` });
		}

		const newType = await assessmentService.createAssessmentType(req.body);

		res.status(201).json({
			message: 'Jenis penilaian berhasil ditambahkan',
			data: newType
		});
	} catch (error) {
		console.error('Error creating assessment type:', error);
		res.status(500).json({ message: error.message });
	}
};

/**
 * PUT /api/assessment-types/:id
 * Update assessment type
 */
export const updateAssessmentType = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { code } = req.body;

		// If changing code, check for duplicates
		if (code) {
			const existing = await assessmentService.getAssessmentTypeById(id);
			if (!existing) {
				return res.status(404).json({ message: 'Jenis penilaian tidak ditemukan' });
			}
			if (code.toUpperCase() !== existing.code) {
				const duplicate = await assessmentService.getAssessmentTypeByCode(code);
				if (duplicate) {
					return res.status(400).json({ message: `Kode penilaian "${code}" sudah digunakan` });
				}
			}
		}

		const updated = await assessmentService.updateAssessmentType(id, req.body);

		if (!updated) {
			return res.status(404).json({ message: 'Jenis penilaian tidak ditemukan' });
		}

		res.status(200).json({
			message: 'Jenis penilaian berhasil diperbarui',
			data: updated
		});
	} catch (error) {
		console.error('Error updating assessment type:', error);
		res.status(500).json({ message: error.message });
	}
};

/**
 * PATCH /api/assessment-types/:id/toggle
 * Toggle assessment type active status
 */
export const toggleAssessmentTypeStatus = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const updated = await assessmentService.toggleAssessmentTypeStatus(id);

		if (!updated) {
			return res.status(404).json({ message: 'Jenis penilaian tidak ditemukan' });
		}

		res.status(200).json({
			message: `Status berhasil diubah menjadi ${updated.isActive ? 'Aktif' : 'Nonaktif'}`,
			data: updated
		});
	} catch (error) {
		console.error('Error toggling assessment type:', error);
		res.status(500).json({ message: error.message });
	}
};

/**
 * DELETE /api/assessment-types/:id
 * Delete assessment type (only if not used)
 */
export const deleteAssessmentType = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await assessmentService.deleteAssessmentType(id);

		if (!result) {
			return res.status(404).json({ message: 'Jenis penilaian tidak ditemukan' });
		}

		if (!result.deleted) {
			return res.status(400).json({
				message: `Tidak dapat menghapus. Jenis penilaian ini digunakan oleh ${result.usageCount} nilai siswa. Nonaktifkan saja jika tidak ingin dipakai lagi.`
			});
		}

		res.status(200).json({
			message: 'Jenis penilaian berhasil dihapus'
		});
	} catch (error) {
		console.error('Error deleting assessment type:', error);
		res.status(500).json({ message: error.message });
	}
};
