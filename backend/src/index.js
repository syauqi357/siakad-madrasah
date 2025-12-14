// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { studentTable } from './db/schema/studentsdataTable.js';
import { schoolTable } from './db/schema/schooldataTable.js';

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite);

export { studentTable, schoolTable };