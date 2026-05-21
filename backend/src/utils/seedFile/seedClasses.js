import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { db } from '../../db/index.js';
import { classes } from '../../db/schema/classesDataTable.js';

// 1. The Data Dictionary (Declarative, no floating variables)
const LEVEL_MAP = {
   '1': ['I', 'II', 'III', 'IV', 'V', 'VI'],
   '2': ['VII', 'VIII', 'IX'],
   '3': ['X', 'XI', 'XII'],
   '4': ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
};

async function seedClasses() {
   console.log('🌱 Menyiapkan Seeding Tingkat Kelas...\n');

   const rl = readline.createInterface({ input, output });
   const promptText = `Pilih Tingkat Sekolah yang ingin digunakan:
  1. SD / MI (Kelas I - VI)
  2. SMP / MTs (Kelas VII - IX)
  3. SMA / MA (Kelas X - XII)
  4. Semuanya (SD sampai SMA)
\nMasukkan angka (1/2/3/4): `;

   const answer = await rl.question(promptText);
   rl.close();

   // 2. Direct mapping: Grab the array directly using the user's input
   const selectedLevels = LEVEL_MAP[answer];

   if (!selectedLevels) {
      console.log('❌ Pilihan tidak valid. Seeding dibatalkan.');
      process.exit(1);
   }

   // 3. Transform the array of strings into Drizzle's object format
   const classData = selectedLevels.map(level => ({ className: level }));

   try {
      console.log(`\n📚 Memasukkan ${classData.length} tingkat kelas ke database...`);
      
      await db.insert(classes).values(classData);
      
      console.log('   ✅ Berhasil! Tingkat kelas sudah tersimpan.');
      console.log('\n🎉 Seeding selesai!');
   } catch (error) {
      console.error('❌ Seeding gagal:', error);
   }

   process.exit(0);
}

seedClasses();