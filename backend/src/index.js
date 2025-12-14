// src/db/index.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { usersTable } from './db/schema.js'; // your schema file

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite);

export { usersTable };