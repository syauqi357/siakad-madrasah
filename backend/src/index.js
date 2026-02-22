// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { studentTable } from './db/schema/studentsdataTable.js';
import { schoolDataTable } from './db/schema/schooldataTable.js';
import { auditTable } from './db/schema/auditlog.js';
import { rombelStudents } from './db/schema/rombelStudents.js'; // Import the new table
import {
	teachersRelations,
	subjectsRelations,
	academicYearsRelations,
	classesRelations,
	rombelRelations,
	classSubjectsRelations
} from './db/schema/relations.js';
import { schoolFacilitiesTable } from './db/schema/schoolFacilities.js';
import { buildingsSchoolTable } from './db/schema/buildingsSchool.js';

// Get database path - supports both regular Node and Electron environments
function getDatabasePath() {
	// If DATABASE_URL is an absolute path, use it directly
	const dbUrl = process.env.DATABASE_URL || 'siakad.db';

	if (path.isAbsolute(dbUrl)) {
		return dbUrl;
	}

	// For relative paths, resolve from backend directory
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const backendDir = path.join(__dirname, '..');

	return path.join(backendDir, dbUrl);
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
