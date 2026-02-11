import * as classSubjectService from '../services/classSubject.service.js';

/**
 * GET /class-subjects
 * Get all class-subject assignments, optionally filtered by classId
 */
export const getAllClassSubjects = async (req, res) => {
	try {
		const { classId } = req.query;
		const data = await classSubjectService.getAllClassSubjects(
			classId ? parseInt(classId) : null
		);

		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching class-subjects:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data penugasan mapel',
			error: error.message
		});
	}
};

/**
 * GET /class-subjects/:id
 * Get single class-subject by ID
 */
export const getClassSubjectById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await classSubjectService.getClassSubjectById(parseInt(id));

		if (!data) {
			return res.status(404).json({
				success: false,
				message: 'Data tidak ditemukan'
			});
		}

		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching class-subject:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data',
			error: error.message
		});
	}
};

/**
 * POST /class-subjects
 * Create new class-subject assignment
 */
export const createClassSubject = async (req, res) => {
	try {
		const { classId, subjectId, teacherId } = req.body;

		if (!classId || !subjectId) {
			return res.status(400).json({
				success: false,
				message: 'classId dan subjectId wajib diisi'
			});
		}

		const data = await classSubjectService.createClassSubject({
			classId: parseInt(classId),
			subjectId: parseInt(subjectId),
			teacherId: teacherId ? parseInt(teacherId) : null
		});

		if (data?.error === 'DUPLICATE_ASSIGNMENT') {
			return res.status(409).json({
				success: false,
				message: 'Mata pelajaran sudah ditugaskan ke kelas ini'
			});
		}

		res.status(201).json({
			success: true,
			message: 'Berhasil menambahkan penugasan mapel',
			data
		});
	} catch (error) {
		console.error('Error creating class-subject:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal menambahkan penugasan mapel',
			error: error.message
		});
	}
};

/**
 * PUT /class-subjects/:id
 * Update class-subject assignment (change teacher)
 */
export const updateClassSubject = async (req, res) => {
	try {
		const { id } = req.params;
		const { teacherId, classId, subjectId } = req.body;

		const data = await classSubjectService.updateClassSubject(parseInt(id), {
			teacherId: teacherId !== undefined ? (teacherId ? parseInt(teacherId) : null) : undefined,
			classId: classId ? parseInt(classId) : undefined,
			subjectId: subjectId ? parseInt(subjectId) : undefined
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: 'Data tidak ditemukan'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Berhasil memperbarui penugasan mapel',
			data
		});
	} catch (error) {
		console.error('Error updating class-subject:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal memperbarui penugasan mapel',
			error: error.message
		});
	}
};

/**
 * DELETE /class-subjects/:id
 * Delete class-subject assignment
 */
export const deleteClassSubject = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await classSubjectService.deleteClassSubject(parseInt(id));

		if (!data) {
			return res.status(404).json({
				success: false,
				message: 'Data tidak ditemukan'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Berhasil menghapus penugasan mapel',
			data
		});
	} catch (error) {
		console.error('Error deleting class-subject:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal menghapus penugasan mapel',
			error: error.message
		});
	}
};

/**
 * GET /class-subjects/dropdown/classes
 * Get classes for dropdown
 */
export const getClassesDropdown = async (req, res) => {
	try {
		const data = await classSubjectService.getClassesLite();
		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching classes:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data kelas',
			error: error.message
		});
	}
};

/**
 * GET /class-subjects/dropdown/subjects
 * Get subjects for dropdown
 */
export const getSubjectsDropdown = async (req, res) => {
	try {
		const data = await classSubjectService.getSubjectsLite();
		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching subjects:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data mapel',
			error: error.message
		});
	}
};

/**
 * GET /class-subjects/dropdown/teachers
 * Get teachers for dropdown
 */
export const getTeachersDropdown = async (req, res) => {
	try {
		const data = await classSubjectService.getTeachersLite();
		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching teachers:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data guru',
			error: error.message
		});
	}
};

/**
 * GET /class-subjects/unassigned/:classId
 * Get subjects not yet assigned to a class
 */
export const getUnassignedSubjects = async (req, res) => {
	try {
		const { classId } = req.params;
		const data = await classSubjectService.getUnassignedSubjects(parseInt(classId));

		res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error fetching unassigned subjects:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal mengambil data mapel',
			error: error.message
		});
	}
};
