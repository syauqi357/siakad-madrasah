import * as academicYearService from '../services/academicYear.services.js';

/**
 * GET /academic-years - Get all academic years
 */
export const getAll = (req, res) => {
	try {
		const years = academicYearService.getAllAcademicYears();
		res.json({ success: true, data: years });
	} catch (error) {
		console.error('Error getting academic years:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/lite - Get academic years for dropdown
 */
export const getLite = (req, res) => {
	try {
		const years = academicYearService.getAcademicYearsLite();
		res.json({ success: true, data: years });
	} catch (error) {
		console.error('Error getting academic years lite:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/active - Get active academic year
 */
export const getActive = (req, res) => {
	try {
		const year = academicYearService.getActiveAcademicYear();
		if (!year) {
			return res.status(404).json({ success: false, message: 'Tidak ada tahun ajaran aktif' });
		}
		res.json({ success: true, data: year });
	} catch (error) {
		console.error('Error getting active academic year:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/:id - Get single academic year
 */
export const getById = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const year = academicYearService.getAcademicYearById(id);

		if (!year) {
			return res.status(404).json({ success: false, message: 'Tahun ajaran tidak ditemukan' });
		}

		res.json({ success: true, data: year });
	} catch (error) {
		console.error('Error getting academic year:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * POST /academic-years - Create new academic year
 */
export const create = (req, res) => {
	try {
		const { name, startYear, endYear, startDate, endDate, isActive } = req.body;

		if (!name) {
			return res.status(400).json({ success: false, message: 'Nama tahun ajaran wajib diisi' });
		}

		const created = academicYearService.createAcademicYear({
			name,
			startYear,
			endYear,
			startDate,
			endDate,
			isActive
		});

		res.status(201).json({ success: true, message: 'Tahun ajaran berhasil dibuat', data: created });
	} catch (error) {
		console.error('Error creating academic year:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * PUT /academic-years/:id - Update academic year
 */
export const update = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const updated = academicYearService.updateAcademicYear(id, req.body);
		res.json({ success: true, message: 'Tahun ajaran berhasil diupdate', data: updated });
	} catch (error) {
		console.error('Error updating academic year:', error);
		const status = error.message.includes('tidak ditemukan') ? 404 : 500;
		res.status(status).json({ success: false, message: error.message });
	}
};

/**
 * DELETE /academic-years/:id - Delete academic year
 */
export const remove = (req, res) => {
	try {
		const id = parseInt(req.params.id);
		academicYearService.deleteAcademicYear(id);
		res.json({ success: true, message: 'Tahun ajaran berhasil dihapus' });
	} catch (error) {
		console.error('Error deleting academic year:', error);
		const status = error.message.includes('tidak ditemukan') ? 404 : 500;
		res.status(status).json({ success: false, message: error.message });
	}
};
