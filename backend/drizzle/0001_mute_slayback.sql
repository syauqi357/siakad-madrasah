PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student` (
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
--> statement-breakpoint
INSERT INTO `__new_student`("id", "nisn", "nis", "name", "class", "gender", "cityOfOrigin", "status", "age", "address") SELECT "id", "nisn", "nis", "name", "class", "gender", "cityOfOrigin", "status", "age", "address" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;