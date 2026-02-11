import * as promotionService from '../services/promotion.services.js';

/**
 * GET /promotion/rombels
 * Get all rombels available for promotion with student counts
 */
export const getRombelsForPromotion = (req, res) => {
	try {
		const { academicYearId } = req.query;
		const rombels = promotionService.getRombelsForPromotion(
			academicYearId ? parseInt(academicYearId) : null
		);

		// Group by class level
		const grouped = rombels.reduce((acc, r) => {
			if (!acc[r.className]) {
				acc[r.className] = {
					classId: r.classId,
					className: r.className,
					isFinalGrade: r.isFinalGrade,
					rombels: []
				};
			}
			acc[r.className].rombels.push(r);
			return acc;
		}, {});

		res.json({
			success: true,
			data: Object.values(grouped)
		});
	} catch (error) {
		console.error('Error getting rombels for promotion:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Gagal mengambil data rombel'
		});
	}
};

/**
 * GET /promotion/students/:rombelId
 * Get active students from a rombel for promotion
 */
export const getStudentsForPromotion = (req, res) => {
	try {
		const { rombelId } = req.params;

		if (!rombelId) {
			return res.status(400).json({
				success: false,
				message: 'Rombel ID diperlukan'
			});
		}

		const students = promotionService.getStudentsForPromotion(parseInt(rombelId));

		res.json({
			success: true,
			data: students,
			count: students.length
		});
	} catch (error) {
		console.error('Error getting students for promotion:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Gagal mengambil data siswa'
		});
	}
};

/**
 * GET /promotion/targets/:classId
 * Get target rombels for promotion (next class level)
 */
export const getTargetRombels = (req, res) => {
	try {
		const { classId } = req.params;

		if (!classId) {
			return res.status(400).json({
				success: false,
				message: 'Class ID diperlukan'
			});
		}

		const targets = promotionService.getTargetRombels(parseInt(classId));

		res.json({
			success: true,
			data: targets
		});
	} catch (error) {
		console.error('Error getting target rombels:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Gagal mengambil data rombel tujuan'
		});
	}
};

/**
 * POST /promotion/promote
 * Promote selected students to target rombel
 */
export const promoteStudents = (req, res) => {
	try {
		const { studentIds, targetRombelId } = req.body;

		if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Pilih minimal satu siswa untuk dipromosikan'
			});
		}

		if (!targetRombelId) {
			return res.status(400).json({
				success: false,
				message: 'Rombel tujuan diperlukan'
			});
		}

		const result = promotionService.promoteStudents(
			studentIds.map((id) => parseInt(id)),
			parseInt(targetRombelId)
		);

		if (result.error === 'TARGET_NOT_FOUND') {
			return res.status(404).json({
				success: false,
				message: 'Rombel tujuan tidak ditemukan'
			});
		}

		if (result.error === 'CAPACITY_EXCEEDED') {
			return res.status(400).json({
				success: false,
				message: `Kapasitas tidak cukup. Tersedia: ${result.available}, Diminta: ${result.requested}`
			});
		}

		res.json({
			success: true,
			message: `Berhasil mempromosikan ${result.successCount} siswa`,
			data: result
		});
	} catch (error) {
		console.error('Error promoting students:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mempromosikan siswa'
		});
	}
};

/**
 * GET /promotion/academic-years
 * Get academic years for filter
 */
export const getAcademicYears = (req, res) => {
	try {
		const years = promotionService.getAcademicYears();
		res.json({
			success: true,
			data: years
		});
	} catch (error) {
		console.error('Error getting academic years:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Gagal mengambil data tahun ajaran'
		});
	}
};

/**
 * GET /promotion/class-levels
 * Get all class levels
 */
export const getClassLevels = (req, res) => {
	try {
		const levels = promotionService.getClassLevels();
		res.json({
			success: true,
			data: levels
		});
	} catch (error) {
		console.error('Error getting class levels:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Gagal mengambil data tingkat kelas'
		});
	}
};
