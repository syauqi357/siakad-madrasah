import Database from 'better-sqlite3';

// Point this to your actual SQLite database file path
const sqlite = new Database('./siakad.db');

function dbFresh() {
	console.log('🧹 Wiping all data from the database...');

	try {
		// 1. Turn off foreign key constraints temporarily so we don't get errors
		// if we delete a parent table before a child table
		sqlite.pragma('foreign_keys = OFF');

		// 2. Get all data tables, excluding SQLite internals and drizzle migration tracking
		const query = sqlite.prepare(`
         SELECT name FROM sqlite_master
         WHERE type='table'
           AND name NOT LIKE 'sqlite_%'
           AND name NOT LIKE '__drizzle_%'
      `);
		const tables = query.all();

		// 3. Loop through every table and delete all rows
		for (const table of tables) {
			sqlite.prepare(`DELETE FROM "${table.name}"`).run();
			console.log(`Deleted data from: ${table.name}`);
		}

		// 4. Reset all auto-increment IDs back to 0
		sqlite.prepare(`DELETE FROM sqlite_sequence`).run();
		console.log('   ✅ All auto-increment IDs reset.');

		// 5. Turn foreign keys back on
		sqlite.pragma('foreign_keys = ON');

		console.log('\n🎉 Database is fresh and empty!');
	} catch (error) {
		console.error('❌ Failed to wipe database:', error);
	}

	sqlite.close();
}

dbFresh();
