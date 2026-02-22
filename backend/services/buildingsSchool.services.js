import { eq, and } from 'drizzle-orm';
import { db, buildingsSchoolTable, schoolFacilitiesTable } from '../src/index.js';

// =====================================================
// READ operations
// =====================================================

export const getAllBuildings = async () => {
	return db.select().from(buildingsSchoolTable);
};

export const getBuildingById = async (id) => {
	const [building] = await db
		.select()
		.from(buildingsSchoolTable)
		.where(eq(buildingsSchoolTable.id, id));
	return building;
};

export const getBuildingsByCategory = async (categoryId) => {
	return db
		.select()
		.from(buildingsSchoolTable)
		.where(eq(buildingsSchoolTable.categoryId, categoryId));
};

export const getBuildingsBySubcategory = async (categoryId, subcategory) => {
	return db
		.select()
		.from(buildingsSchoolTable)
		.where(
			and(
				eq(buildingsSchoolTable.categoryId, categoryId),
				eq(buildingsSchoolTable.subcategory, subcategory)
			)
		);
};

// =====================================================
// WRITE operations
// =====================================================

export const createBuilding = async (data) => {
	const [newBuilding] = await db
		.insert(buildingsSchoolTable)
		.values({
			name: data.name,
			categoryId: data.categoryId,
			subcategory: data.subcategory,
			condition: data.condition || 'baik',
			quantity: data.quantity || 1,
			acquisitionYear: data.acquisitionYear || null,
			acquisitionValue: data.acquisitionValue || null,
			location: data.location || null,
			registrationNumber: data.registrationNumber || null,
			brand: data.brand || null,
			model: data.model || null,
			serialNumber: data.serialNumber || null,
			specifications: data.specifications || null,
			description: data.description || null,
			status: data.status || 'aktif',
			createdAt: Date.now(),
			updatedAt: Date.now()
		})
		.returning();
	return newBuilding;
};

export const updateBuilding = async (id, data) => {
	const [updatedBuilding] = await db
		.update(buildingsSchoolTable)
		.set({
			...data,
			updatedAt: Date.now()
		})
		.where(eq(buildingsSchoolTable.id, id))
		.returning();
	return updatedBuilding;
};

export const deleteBuilding = async (id) => {
	const [deletedBuilding] = await db
		.delete(buildingsSchoolTable)
		.where(eq(buildingsSchoolTable.id, id))
		.returning();
	return deletedBuilding;
};

// =====================================================
// FACILITY IMAGES linked to buildings
// =====================================================

export const getFacilitiesByBuildingId = async (buildingId) => {
	return db
		.select()
		.from(schoolFacilitiesTable)
		.where(eq(schoolFacilitiesTable.buildingId, buildingId));
};