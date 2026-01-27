import {
	getSchoolDataFromDB,
	updateSchoolDataInDB,
	createSchoolDataInDB,
	findLogoFile,
	getFacilitiesData
} from '../services/schoolData.service.js';

// Controller for facility images only
export const getFacilityImages = (req, res) => {
	try {
		const facilities = getFacilitiesData();
		res.json(facilities);
	} catch (error) {
		console.error('Error in getFacilityImages:', error);
		res.status(500).json({
			error: 'Failed to fetch facility images',
			facilities: {}
		});
	}
};

// Controller to get school data from DATABASE
export const getSchoolData = async (req, res) => {
	try {
		// Get the single school record from database
		const schoolData = await getSchoolDataFromDB();

		if (!schoolData) {
			return res.status(404).json({ error: 'School data not found in database' });
		}

		// Merge database data with dynamic file-based data
		const response = {
			...schoolData,
			logoUrl: findLogoFile(), // Override with actual logo file
			...getFacilitiesData() // Add facility images
		};

		res.json(response);
	} catch (error) {
		console.error('Error fetching school data:', error);
		res.status(500).json({ error: 'Failed to fetch school data' });
	}
};

// Update school data (only one record)
export const updateSchoolData = async (req, res) => {
	try {
		const { name, npsn, nsm, akreditasi, alamat, kota, negara } = req.body;

		// Check if school exists
		const existing = await getSchoolDataFromDB();

		if (!existing) {
			return res.status(404).json({ error: 'School data not found. Please create it first.' });
		}

		// Update the single school record
		const updated = await updateSchoolDataInDB(existing.id, {
			name,
			npsn,
			nsm,
			akreditasi,
			alamat,
			kota,
			negara
		});

		res.json({
			message: 'School data updated successfully',
			data: updated
		});
	} catch (error) {
		console.error('Error updating school data:', error);
		res.status(500).json({ error: 'Failed to update school data' });
	}
};

// Create school data (only if it doesn't exist)
export const createSchoolData = async (req, res) => {
	try {
		const { name, npsn, nsm, akreditasi, alamat, kota, negara } = req.body;

		// Check if school already exists
		const existing = await getSchoolDataFromDB();

		if (existing) {
			return res.status(400).json({
				error: 'School data already exists. Use PUT /api/school to update.'
			});
		}

		// Create the school record
		const school = await createSchoolDataInDB({
			name,
			npsn,
			nsm,
			akreditasi,
			alamat,
			kota,
			negara
		});

		res.status(201).json({
			message: 'School data created successfully',
			data: school
		});
	} catch (error) {
		console.error('Error creating school data:', error);
		res.status(500).json({ error: 'Failed to create school data' });
	}
};

