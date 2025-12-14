// backend/src/migrate.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

async function runMigrations() {
  console.log('⏳ Running migrations...');
  
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('✅ Migrations completed!');
  sqlite.close();
}

runMigrations().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});