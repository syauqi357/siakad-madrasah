// controllers/graduateController.js
import * as graduateService from '../services/graduate.services.js';

/**
 * GET /graduates - Get all graduated students (alumni) with pagination and year filter
 */
export const getGraduates = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const year = req.query.year || null;

		const students = await graduateService.getGraduatedStudents({ page, limit, year });
		const totalCount = await graduateService.countGraduates();

		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount / limit)
			}
		});
	} catch (error) {
		console.error('Error in getGraduates controller:', error);
		res.status(500).json({ message: 'Error fetching graduates', error: error.message });
	}
};

/**
 * GET /graduates/stats - Get graduation statistics
 */
export const getGraduateStats = async (req, res) => {
	try {
		const total = await graduateService.countGraduates();
		const byYear = await graduateService.countGraduatesByYear();
		const years = await graduateService.getGraduationYears();

		res.status(200).json({
			total,
			byYear,
			years
		});
	} catch (error) {
		console.error('Error in getGraduateStats controller:', error);
		res.status(500).json({ message: 'Error fetching graduate stats', error: error.message });
	}
};

/**
 * GET /graduates/years - Get distinct graduation years for filter dropdown
 */
export const getGraduationYears = async (req, res) => {
	try {
		const years = await graduateService.getGraduationYears();
		res.status(200).json(years);
	} catch (error) {
		console.error('Error in getGraduationYears controller:', error);
		res.status(500).json({ message: 'Error fetching graduation years', error: error.message });
	}
};

/**
 * GET /graduates/:id - Get single graduate detail
 */
export const getGraduateById = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const graduate = await graduateService.getGraduateById(studentId);

		if (!graduate) {
			return res.status(404).json({ message: 'Alumni tidak ditemukan' });
		}

		res.status(200).json(graduate);
	} catch (error) {
		console.error('Error in getGraduateById controller:', error);
		res.status(500).json({ message: 'Error fetching graduate', error: error.message });
	}
};

/**
 * POST /graduates/:id - Graduate a student
 * Body: { completionDate, graduationYear, certificateNumber?, finalGrade?, scores? }
 */
export const graduateStudent = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const { completionDate, graduationYear, certificateNumber, finalGrade, scores } = req.body;

		if (!completionDate) {
			return res.status(400).json({ message: 'Tanggal kelulusan wajib diisi' });
		}
		if (!graduationYear) {
			return res.status(400).json({ message: 'Tahun kelulusan wajib diisi' });
		}

		const result = await graduateService.graduateStudent(studentId, {
			completionDate,
			graduationYear,
			certificateNumber,
			finalGrade,
			scores
		});

		if (result.error === 'STUDENT_NOT_FOUND') {
			return res.status(404).json({ message: 'Siswa tidak ditemukan' });
		}
		if (result.error === 'NOT_ACTIVE') {
			return res.status(400).json({ message: 'Hanya siswa ACTIVE yang dapat diluluskan' });
		}

		res.status(200).json({
			message: 'Siswa berhasil diluluskan',
			data: result
		});
	} catch (error) {
		console.error('Error in graduateStudent controller:', error);
		res.status(500).json({ message: error.message });
	}
};

/**
 * POST /graduates/bulk - Bulk graduate multiple students
 * Body: { students: [{ studentId, certificateNumber?, finalGrade?, scores? }], commonData: { completionDate, graduationYear } }
 */
export const bulkGraduateStudents = (req, res) => {
	try {
		const { students, commonData } = req.body;

		if (!students || !Array.isArray(students) || students.length === 0) {
			return res.status(400).json({ message: 'Daftar siswa tidak boleh kosong' });
		}

		if (!commonData || !commonData.completionDate || !commonData.graduationYear) {
			return res.status(400).json({ message: 'Tanggal dan tahun kelulusan wajib diisi' });
		}

		const result = graduateService.bulkGraduateStudents(students, commonData);

		res.status(200).json({
			message: `${result.successCount} siswa berhasil diluluskan, ${result.failedCount} gagal`,
			data: result
		});
	} catch (error) {
		console.error('Error in bulkGraduateStudents controller:', error);
		res.status(500).json({ message: error.message });
	}
};

/**
 * PUT /graduates/:id - Update graduate data (certificate number, etc.)
 */
export const updateGraduate = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const updateData = req.body;

		const result = await graduateService.updateGraduateData(studentId, updateData);

		if (result?.error === 'NOT_GRADUATE') {
			return res.status(404).json({ message: 'Siswa bukan alumni' });
		}
		if (result?.error === 'HISTORY_NOT_FOUND') {
			return res.status(404).json({ message: 'Data history tidak ditemukan' });
		}
		if (result?.error === 'NO_DATA') {
			return res.status(400).json({ message: 'Tidak ada data yang diupdate' });
		}

		res.status(200).json({
			message: 'Data alumni berhasil diupdate',
			data: result
		});
	} catch (error) {
		console.error('Error in updateGraduate controller:', error);
		res.status(500).json({ message: error.message });
	}
};
