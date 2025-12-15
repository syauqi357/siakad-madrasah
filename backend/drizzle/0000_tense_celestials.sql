CREATE TABLE `school_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`npsn` integer NOT NULL,
	`nsm` integer NOT NULL,
	`akreditasi` text NOT NULL,
	`alamat` text NOT NULL,
	`kota` text NOT NULL,
	`negara` text NOT NULL,
	`logoUrl` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nisn` integer NOT NULL,
	`nis` integer NOT NULL,
	`name` text NOT NULL,
	`class` text NOT NULL,
	`gender` text NOT NULL,
	`cityOfOrigin` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`age` integer NOT NULL,
	`address` text NOT NULL
);
