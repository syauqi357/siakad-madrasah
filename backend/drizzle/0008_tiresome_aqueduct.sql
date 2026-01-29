PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_name` text NOT NULL,
	`nisn` integer NOT NULL,
	`local_nis` integer,
	`gender` text,
	`religion` text,
	`birth_place` text,
	`birth_date` text,
	`previous_school` text,
	`phone_number` text,
	`child_order` integer,
	`siblings_count` integer,
	`origin_region` text,
	`bpjs` text,
	`id_card_number` text,
	`birth_certificate_number` text,
	`nationality` text DEFAULT 'Indonesia',
	`living_with` text,
	`transportation` text,
	`profile_photo` text,
	`rombel_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_student`("id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "rombel_id", "created_at", "updated_at") SELECT "id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "rombel_id", "created_at", "updated_at" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `student_nisn_unique` ON `student` (`nisn`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_local_nis_unique` ON `student` (`local_nis`);--> statement-breakpoint
CREATE INDEX `idx_students_nisn` ON `student` (`nisn`);--> statement-breakpoint
CREATE INDEX `idx_students_student_name` ON `student` (`student_name`);--> statement-breakpoint
CREATE INDEX `idx_students_local_nis` ON `student` (`local_nis`);--> statement-breakpoint
CREATE TABLE `__new_school_facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`facilityType` text NOT NULL,
	`subFolder` text,
	`imagePath` text NOT NULL,
	`caption` text,
	`displayOrder` integer DEFAULT 0,
	`createdAt` integer DEFAULT 1769685672124
);
--> statement-breakpoint
INSERT INTO `__new_school_facilities`("id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "createdAt") SELECT "id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "createdAt" FROM `school_facilities`;--> statement-breakpoint
DROP TABLE `school_facilities`;--> statement-breakpoint
ALTER TABLE `__new_school_facilities` RENAME TO `school_facilities`;--> statement-breakpoint
ALTER TABLE `subjects` ADD `description` text;--> statement-breakpoint
ALTER TABLE `subjects` ADD `kkm` integer DEFAULT 75;