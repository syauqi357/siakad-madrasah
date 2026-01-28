CREATE TABLE `studentAddress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`province` text,
	`regency` text,
	`district` text,
	`sub_district` text,
	`village` text,
	`hamlet` text,
	`street` text,
	`house_number` text,
	`rt` text,
	`rw` text,
	`postal_code` text,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `studentAddress_student_id_unique` ON `studentAddress` (`student_id`);--> statement-breakpoint
CREATE TABLE `` (

);
--> statement-breakpoint
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_student`("id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "created_at", "updated_at") SELECT "id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "created_at", "updated_at" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `student_nisn_unique` ON `student` (`nisn`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_local_nis_unique` ON `student` (`local_nis`);--> statement-breakpoint
CREATE INDEX `idx_students_nisn` ON `student` (`nisn`);--> statement-breakpoint
CREATE INDEX `idx_students_student_name` ON `student` (`student_name`);--> statement-breakpoint
CREATE INDEX `idx_students_local_nis` ON `student` (`local_nis`);