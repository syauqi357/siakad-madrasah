import { db } from '../../db/index.js';
import { classes } from '../../db/schema/classesDataTable.js';

export async function seedClassesAuto() {
   const selectedLevels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
   const classData = selectedLevels.map(level => ({ className: level }));

   try {
      console.log(`\n📚 Inserting ${classData.length} class levels into database...`);
      await db.insert(classes).values(classData);
      console.log('   ✅ Success!');
   } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
   }
}
