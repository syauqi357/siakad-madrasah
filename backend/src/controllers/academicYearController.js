import * as academicYearService from '../services/academicYear.services.js';

/**
 * GET /academic-years - Get all academic years
 */
export const getAll = (request, response) => {
	try {
		const years = academicYearService.getAllAcademicYears();
		response.json({ success: true, data: years });
	} catch (error) {
		// console.error('Error getting academic years:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/lite - Get academic years for dropdown
 */
export const getLite = (request, response) => {
	try {
		const years = academicYearService.getAcademicYearsLite();
		response.json({ success: true, data: years });
	} catch (error) {
		// console.error('Error getting academic years lite:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/active - Get active academic year
 */
export const getActive = (request, response) => {
	try {
		const year = academicYearService.getActiveAcademicYear();
		if (!year) {
			return response.status(404).json({ success: false, message: 'Tidak ada tahun ajaran aktif' });
		}
		response.json({ success: true, data: year });
	} catch (error) {
		// console.error('Error getting active academic year:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * GET /academic-years/:id - Get single academic year
 */
export const getById = (request, response) => {
	try {
		const id = parseInt(request.params.id);
		const year = academicYearService.getAcademicYearById(id);

		if (!year) {
			return response.status(404).json({ success: false, message: 'Tahun ajaran tidak ditemukan' });
		}

		response.json({ success: true, data: year });
	} catch (error) {
		// console.error('Error getting academic year:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * POST /academic-years - Create new academic year
 */
export const create = (request, response) => {
	try {
		const { name, startYear, endYear, startDate, endDate, isActive } = request.body;

		if (!name) {
			return response.status(400).json({ success: false, message: 'Nama tahun ajaran wajib diisi' });
		}

		const created = academicYearService.createAcademicYear({
			name,
			startYear,
			endYear,
			startDate,
			endDate,
			isActive
		});

		response.status(201).json({ success: true, message: 'Tahun ajaran berhasil dibuat', data: created });
	} catch (error) {
		// console.error('Error creating academic year:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * PUT /academic-years/:id - Update academic year
 */
export const update = (request, response) => {
	try {
		const id = parseInt(request.params.id);
		const updated = academicYearService.updateAcademicYear(id, request.body);

		if (!updated) {
			return response.status(404).json({ success: false, message: 'Tahun ajaran tidak ditemukan' });
		}

		response.json({ success: true, message: 'Tahun ajaran berhasil diupdate', data: updated });
	} catch (error) {
		// console.error('Error updating academic year:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};

/**
 * DELETE /academic-years/:id - Delete academic year
 */
export const remove = (request, response) => {
	try {
		const id = parseInt(request.params.id);
		const result = academicYearService.deleteAcademicYear(id);

		if (!result) {
			return response.status(404).json({ success: false, message: 'Tahun ajaran tidak ditemukan' });
		}

		response.json({ success: true, message: 'Tahun ajaran berhasil dihapus' });
	} catch (error) {
		// console.error('Error deleting academic year:', error);
		response.status(500).json({ success: false, message: error.message });
	}
};
