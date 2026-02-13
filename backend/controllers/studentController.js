// controllers/studentController.js
import * as studentService from '../services/student.service.js';

// Controller to get all student data
export const getAllStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;

		const students = await studentService.findAllStudents(page, limit);
		const totalCount = await studentService.countStudents();

		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount.count,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student data', error: error.message });
	}
};

// Controller to get lite student data (for dropdowns/lists)
export const getStudentsLite = async (req, res) => {
	try {
		const students = await studentService.findAllStudentsLite();
		res.status(200).json(students);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student list', error: error.message });
	}
};

// student counter data
export const getStudentCount = async (req, res) => {
	try {
		const result = await studentService.countStudents();
		res.status(200).json(result);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student counts', error: error.message });
	}
};

// Search students by name, NISN, or local NIS
export const searchStudents = async (req, res) => {
	try {
		const { q, page, limit, status } = req.query;

		if (!q || q.trim() === '') {
			return res.status(400).json({ message: 'Search query (q) is required' });
		}

		const pageNum = parseInt(page) || 1;
		const limitNum = parseInt(limit) || 10;
		const statusFilter = status || null;

		const students = await studentService.searchStudents(q, pageNum, limitNum, statusFilter);

		res.status(200).json({
			data: students,
			query: q,
			status: statusFilter,
			pagination: {
				page: pageNum,
				limit: limitNum
			}
		});
	} catch (error) {
		console.error('Search error:', error);
		res.status(500).json({ message: 'Error searching students', error: error.message });
	}
};

// controller to get student by id
export const getStudentById = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const student = await studentService.findStudentById(studentId);

		if (!student) {
			return res.status(404).json({ message: `No student found with id ${studentId}` });
		}

		// Handle BigInt serialization + coerce document numbers to strings
		const DOC_FIELDS = ['nisn', 'localNis', 'nik', 'bpjs', 'idCardNumber', 'birthCertificateNumber'];
		const serializedStudent = JSON.parse(
			JSON.stringify(student, (key, value) => {
				if (typeof value === 'bigint') return value.toString();
				if (DOC_FIELDS.includes(key) && typeof value === 'number') {
					return Number.isInteger(value) ? value.toFixed(0) : String(value);
				}
				return value;
			})
		);

		res.status(200).json(serializedStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching student data', error: error.message });
	}
};

export const createStudent = async (req, res) => {
	try {
		const newStudent = await studentService.createStudentData(req.body);

		// Handle BigInt serialization + coerce document numbers to strings
		const DOC_FIELDS = ['nisn', 'localNis', 'nik', 'bpjs', 'idCardNumber', 'birthCertificateNumber'];
		const serializedStudent = JSON.parse(
			JSON.stringify(newStudent, (key, value) => {
				if (typeof value === 'bigint') return value.toString();
				if (DOC_FIELDS.includes(key) && typeof value === 'number') {
					return Number.isInteger(value) ? value.toFixed(0) : String(value);
				}
				return value;
			})
		);

		res.status(201).json(serializedStudent);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error creating student', error: error.message });
	}
};

export const createBulkStudent = async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).json({
				message: 'Tidak ada file yang diunggah. Silakan pilih file Excel terlebih dahulu.'
			});
		}
		const newBulkStudent = await studentService.createBulkStudentsFromExcel(file.buffer);
		res.status(201).json({
			message: `Berhasil mengunggah ${newBulkStudent.length} data siswa.`,
			data: newBulkStudent
		});
	} catch (error) {
		console.error('Bulk upload error:', error);

		// User-friendly error messages in Indonesian
		const errorMessages = {
			BULK_INVALID_FILE:
				'File tidak dapat dibaca. Pastikan file berformat Excel (.xlsx) dan tidak rusak.',
			BULK_NO_WORKSHEET:
				'File Excel kosong atau tidak memiliki sheet data. Pastikan menggunakan template yang benar.',
			BULK_WRONG_TEMPLATE:
				'Format file tidak sesuai template. Silakan unduh template terlebih dahulu, isi datanya, lalu unggah kembali.',
			BULK_EMPTY_DATA:
				'File template tidak berisi data siswa. Silakan isi minimal 1 baris data pada template.'
		};

		const userMessage =
			errorMessages[error.message] ||
			'Gagal mengunggah data siswa. Pastikan Anda menggunakan template yang telah disediakan dan semua kolom wajib sudah terisi.';

		const statusCode = errorMessages[error.message] ? 400 : 500;
		res.status(statusCode).json({ message: userMessage });
	}
};

export const downloadStudentBulkTemplate = async (req, res) => {
	try {
		const workbook = await studentService.createStudentdataInputExcelBulkGenerator();

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader('Content-Disposition', 'attachment; filename="Template_Data_Siswa.xlsx"');
		res.setHeader('Cache-Control', 'no-store');

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error('Error generating student bulk template:', error);
		res.status(500).json({ message: 'Error generating template', error: error.message });
	}
};

export const updateStudent = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const updated = await studentService.updateStudentData(studentId, req.body);

		if (!updated) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json(updated);
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error updating student', error: error.message });
	}
};

export const deleteStudent = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const deleted = await studentService.deleteStudentData(studentId);

		if (!deleted) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({ message: 'Student deleted successfully', student: deleted });
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error deleting student', error: error.message });
	}
};

// ==================== PHOTO UPLOAD CONTROLLER ====================

/**
 * POST /students/:id/photo - Upload student profile photo
 */
export const uploadStudentPhoto = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);

		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		// Relative path for database storage (accessible via static middleware)
		const photoPath = `/upload/Profile/studentProfile/${req.file.filename}`;

		const updated = await studentService.updateStudentPhoto(studentId, photoPath);

		if (!updated) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.status(200).json({
			message: 'Photo uploaded successfully',
			data: {
				studentId: updated.id,
				profilePhoto: updated.profilePhoto
			}
		});
	} catch (error) {
		console.error('Photo upload error:', error);
		res.status(500).json({ message: error.message });
	}
};

// ==================== STATUS MANAGEMENT CONTROLLERS ====================

/**
 * GET /students/active - Get all active students
 */
export const getActiveStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const students = await studentService.getActiveStudents(page, limit);
		const totalCount = await studentService.countStudentsByStatus('ACTIVE');

		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount.count,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching active students', error: error.message });
	}
};

/**
 * GET /students/dropout - Get all dropout (MUTASI) students
 */
export const getDropoutStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const students = await studentService.getDropoutStudents(page, limit);
		const totalCount = await studentService.countStudentsByStatus('MUTASI');

		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount.count,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching dropout students', error: error.message });
	}
};

/**
 * GET /students/graduated - Get all graduated students
 */
export const getGraduatedStudents = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const students = await studentService.getGraduatedStudents(page, limit);
		const totalCount = await studentService.countStudentsByStatus('GRADUATE');

		res.status(200).json({
			data: students,
			pagination: {
				total: totalCount.count,
				page: page,
				limit: limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: 'Error fetching graduated students', error: error.message });
	}
};

/**
 * POST /students/:id/status - Change student status
 * Body for MUTASI: { status: 'MUTASI', reason, mutasiType, destinationSchool?, completionDate }
 * Body for GRADUATE: { status: 'GRADUATE', scores?, completionDate }
 */
export const changeStudentStatus = async (req, res) => {
	try {
		const studentId = parseInt(req.params.id);
		const { status, scores, reason, mutasiType, destinationSchool, completionDate } = req.body;

		if (!status) {
			return res.status(400).json({ message: 'Status is required' });
		}

		if (!['MUTASI', 'GRADUATE'].includes(status)) {
			return res.status(400).json({ message: 'Invalid status. Must be MUTASI or GRADUATE' });
		}

		// Validate MUTASI requirements
		if (status === 'MUTASI') {
			if (!reason) {
				return res.status(400).json({ message: 'Alasan mutasi wajib diisi' });
			}
			if (!mutasiType) {
				return res.status(400).json({ message: 'Jenis mutasi wajib dipilih' });
			}
		}

		const result = await studentService.changeStudentStatus(studentId, status, {
			scores,
			reason,
			mutasiType,
			destinationSchool,
			completionDate
		});

		if (result?.error === 'STUDENT_NOT_FOUND') {
			return res.status(404).json({ message: 'Student not found' });
		}
		if (result?.error === 'NOT_ACTIVE') {
			return res.status(400).json({ message: 'Only ACTIVE students can change status' });
		}

		res.status(200).json({
			message: `Student status changed to ${status} successfully`,
			data: result
		});
	} catch (error) {
		console.error('Database error:', error);
		res.status(500).json({ message: error.message });
	}
};
