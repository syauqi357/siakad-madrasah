// import drizzle
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

// create table
export const schoolDataTable = sqliteTable(
	'school_data',
	{
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	npsn: int().notNull(),
	nsm: int().notNull(),
	akreditasi: text().notNull(),
	alamat: text().notNull(),
	kota: text().notNull(),
	negara: text().notNull(),
	logoUrl: text().notNull()

	// indexing table here for school, but it wont affect cause only one school data name

});


/*
*
* {
"name": "MTs. AL-HASYIMIY",
"npsn": "84729834789",
"nsm": "73210987219",
"akreditasi": "B",
"alamat": "jalan kh abdul rahman wahid no.3 gang. 7",
"kota":"bangil",
"negara": "indonesia",
"logoUrl": ""
}
*
* */