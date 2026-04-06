// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { studentTable } from './schema/studentsdataTable.js';
import { schoolDataTable } from './schema/schooldataTable.js';
import { auditTable } from './schema/auditlog.js';
import { rombelStudents } from './schema/rombelStudents.js'; // Import the new table
import {
	teachersRelations,
	subjectsRelations,
	academicYearsRelations,
	classesRelations,
	rombelRelations,
	classSubjectsRelations
} from './schema/relations.js';
import { schoolFacilitiesTable } from './schema/schoolFacilities.js';
import { buildingsSchoolTable } from './schema/buildingsSchool.js';

// Get database path - supports both regular Node and Electron environments
function getDatabasePath() {
	// If DATABASE_URL is an absolute path, use it directly
	const DB_URL_POSITIONS = process.env.DATABASE_URL;

	if (path.isAbsolute(DB_URL_POSITIONS)) {
		return DB_URL_POSITIONS;
	}

	// For relative paths, resolve from backend directory
	const __fileName = fileURLToPath(import.meta.url);
	const __directoryName = path.dirname(__fileName);
	const BACKEND_EXPRESS_DIRECTORIES = path.join(__directoryName, '..', '..');

	return path.join(BACKEND_EXPRESS_DIRECTORIES, DB_URL_POSITIONS);
}

const dbPath = getDatabasePath();
console.log('Database path:', dbPath);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

export {
	studentTable,
	schoolDataTable,
	auditTable,
	rombelStudents,
	teachersRelations,
	subjectsRelations,
	academicYearsRelations,
	classesRelations,
	rombelRelations,
	classSubjectsRelations,
	schoolFacilitiesTable,
	buildingsSchoolTable
};
