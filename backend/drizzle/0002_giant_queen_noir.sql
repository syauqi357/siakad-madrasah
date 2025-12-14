CREATE TABLE `schoolData` (
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
DROP TABLE `student`;