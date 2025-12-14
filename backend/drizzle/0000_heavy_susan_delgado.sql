CREATE TABLE `student` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`class` text NOT NULL,
	`gender` text,
	`cityOfOrigin` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`age` integer NOT NULL,
	`address` text NOT NULL
);
