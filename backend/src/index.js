// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { studentTable } from './db/schema/studentsdataTable.js';
import { schoolDataTable } from './db/schema/schooldataTable.js';
import { auditTable } from './db/schema/auditlog.js';
import { teachersRelations, subjectsRelations, academicYearsRelations, classesRelations, rombelRelations, classSubjectsRelations } from './db/schema/relations.js'


const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite);

export { studentTable, schoolDataTable, auditTable, teachersRelations, subjectsRelations, academicYearsRelations, classesRelations, rombelRelations, classSubjectsRelations };
