// backend/src/seed.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { studentTable } from './db/schema/schema.js';

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite);

async function seed() {
  console.log('🌱 Seeding database...');

  await db.insert(studentTable).values([
    {
      name: 'Budi Santoso',
      nisn: 1234567890,
      nis: 1234567890,
      class: '10A',
      gender: 'laki-laki',
      cityOfOrigin: 'Surabaya',
      status: 'active',
      age: 16,
      address: 'Jl. Merdeka No. 10, Surabaya'
    },
    {
      name: 'Siti Nurhaliza',
      nisn: 1234567890,
      nis: 1234567890,
      class: '10B',
      gender: 'female',
      cityOfOrigin: 'Jakarta',
      status: 'active',
      age: 15,
      address: 'Jl. Sudirman No. 20, Jakarta'
    },
    {
      name: 'Ahmad Rizki',
      nisn: 1234567890,
      nis: 1234567890,
      class: '11A',
      gender: 'male',
      cityOfOrigin: 'Bandung',
      status: 'active',
      age: 17,
      address: 'Jl. Asia Afrika No. 5, Bandung'
    },
    {
      name: 'Dewi Lestari',
      nisn: 1234567890,
      nis: 1234567890,
      class: '11B',
      gender: 'female',
      cityOfOrigin: 'Yogyakarta',
      status: 'warning',
      age: 16,
      address: 'Jl. Malioboro No. 15, Yogyakarta'
    },
    {
      name: 'Rudi Hermawan',
      nisn: 1234567890,
      nis: 1234567890,
      class: '12A',
      gender: 'male',
      cityOfOrigin: 'Semarang',
      status: 'alumni',
      age: 18,
      address: 'Jl. Pemuda No. 30, Semarang'
    }
  ]);

  console.log('✅ Seed data inserted successfully!');
  sqlite.close();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});