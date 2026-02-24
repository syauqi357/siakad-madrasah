import {
	getAllBuildings,
	getBuildingById,
	getBuildingsByCategory,
	getBuildingsBySubcategory,
	createBuilding,
	updateBuilding,
	deleteBuilding,
	getFacilitiesByBuildingId
} from '../services/buildingsSchool.services.js';

// GET /buildings-school
export const getAll = async (req, res) => {
	try {
		const buildings = await getAllBuildings();
		res.json(buildings);
	} catch (error) {
		console.error('Error fetching buildings:', error);
		res.status(500).json({ error: 'Failed to fetch buildings data' });
	}
};

// GET /buildings-school/category/:categoryId
export const getByCategory = async (req, res) => {
	try {
		const categoryId = parseInt(req.params.categoryId);
		if (isNaN(categoryId) || categoryId < 1 || categoryId > 6) {
			return res.status(400).json({ error: 'Invalid categoryId (must be 1-6)' });
		}

		const buildings = await getBuildingsByCategory(categoryId);
		res.json(buildings);
	} catch (error) {
		console.error('Error fetching buildings by category:', error);
		res.status(500).json({ error: 'Failed to fetch buildings by category' });
	}
};

// GET /buildings-school/category/:categoryId/sub/:subcategory
export const getBySubcategory = async (req, res) => {
	try {
		const categoryId = parseInt(req.params.categoryId);
		const subcategory = decodeURIComponent(req.params.subcategory);

		if (isNaN(categoryId) || categoryId < 1 || categoryId > 6) {
			return res.status(400).json({ error: 'Invalid categoryId (must be 1-6)' });
		}

		const buildings = await getBuildingsBySubcategory(categoryId, subcategory);
		res.json(buildings);
	} catch (error) {
		console.error('Error fetching buildings by subcategory:', error);
		res.status(500).json({ error: 'Failed to fetch buildings by subcategory' });
	}
};

// GET /buildings-school/:id
export const getById = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}

		const building = await getBuildingById(id);
		if (!building) {
			return res.status(404).json({ error: 'Building not found' });
		}

		res.json(building);
	} catch (error) {
		console.error('Error fetching building:', error);
		res.status(500).json({ error: 'Failed to fetch building' });
	}
};

// GET /buildings-school/:id/facilities
export const getFacilities = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}

		const facilities = await getFacilitiesByBuildingId(id);
		res.json(facilities);
	} catch (error) {
		console.error('Error fetching building facilities:', error);
		res.status(500).json({ error: 'Failed to fetch building facilities' });
	}
};

// POST /buildings-school
export const create = async (req, res) => {
	try {
		const { name, categoryId, subcategory } = req.body;

		if (!name || !categoryId || !subcategory) {
			return res.status(400).json({
				error: 'Missing required fields: name, categoryId, subcategory'
			});
		}

		const parsedCategoryId = parseInt(categoryId);
		if (isNaN(parsedCategoryId) || parsedCategoryId < 1 || parsedCategoryId > 6) {
			return res.status(400).json({ error: 'Invalid categoryId (must be 1-6)' });
		}

		const newBuilding = await createBuilding({
			...req.body,
			categoryId: parsedCategoryId
		});

		res.status(201).json({
			message: 'Building asset created successfully',
			data: newBuilding
		});
	} catch (error) {
		console.error('Error creating building:', error);
		res.status(500).json({ error: 'Failed to create building asset' });
	}
};

// PUT /buildings-school/:id
export const update = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}

		const existing = await getBuildingById(id);
		if (!existing) {
			return res.status(404).json({ error: 'Building not found' });
		}

		const updatedBuilding = await updateBuilding(id, req.body);
		res.json({
			message: 'Building asset updated successfully',
			data: updatedBuilding
		});
	} catch (error) {
		console.error('Error updating building:', error);
		res.status(500).json({ error: 'Failed to update building asset' });
	}
};

// DELETE /buildings-school/:id
export const remove = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}

		const existing = await getBuildingById(id);
		if (!existing) {
			return res.status(404).json({ error: 'Building not found' });
		}

		const deletedBuilding = await deleteBuilding(id);
		res.json({
			message: 'Building asset deleted successfully',
			data: deletedBuilding
		});
	} catch (error) {
		console.error('Error deleting building:', error);
		res.status(500).json({ error: 'Failed to delete building asset' });
	}
};