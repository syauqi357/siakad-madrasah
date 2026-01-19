// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { studentTable } from './db/schema/studentsdataTable.js';
import { schoolDataTable } from './db/schema/schooldataTable.js';
import { auditTable } from './db/schema/auditlog.js';
import { rombelStudents } from './db/schema/rombelStudents.js'; // Import the new table
import { teachersRelations, subjectsRelations, academicYearsRelations, classesRelations, rombelRelations, classSubjectsRelations } from './db/schema/relations.js'
// import {} from '';


const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite);

export { studentTable, schoolDataTable, auditTable, rombelStudents, teachersRelations, subjectsRelations, academicYearsRelations, classesRelations, rombelRelations, classSubjectsRelations };
