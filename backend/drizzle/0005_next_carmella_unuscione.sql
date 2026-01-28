ALTER TABLE `` RENAME TO `school_data`;--> statement-breakpoint
CREATE TABLE `rombel_students` (
	`rombel_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	PRIMARY KEY(`rombel_id`, `student_id`),
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
CREATE TABLE `student_Attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`rombel_id` integer NOT NULL,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`check_in_time` text,
	`check_out_time` text,
	`note` text,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_student_attendance` ON `student_Attendance` (`student_id`,`rombel_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_student_attendance_student` ON `student_Attendance` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_student_attendance_date` ON `student_Attendance` (`date`);--> statement-breakpoint
CREATE TABLE `student_father` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`nik` text,
	`family_card_number_id` text,
	`religion` text,
	`name` text,
	`birth_place` text,
	`birth_date` text,
	`birth_year` integer,
	`education` text,
	`occupation` text,
	`monthly_income` real,
	`phone_number` text,
	`is_alive` integer DEFAULT 1,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_father_student_id_unique` ON `student_father` (`student_id`);--> statement-breakpoint
CREATE TABLE `student_mother` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`nik` text,
	`name` text,
	`birth_place` text,
	`birth_date` text,
	`birth_year` integer,
	`family_card_number_id` text,
	`religion` text,
	`education` text,
	`occupation` text,
	`monthly_income` real,
	`phone_number` text,
	`is_alive` integer DEFAULT 1,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_mother_student_id_unique` ON `student_mother` (`student_id`);--> statement-breakpoint
CREATE TABLE `student` (
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
CREATE UNIQUE INDEX `student_nisn_unique` ON `student` (`nisn`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_local_nis_unique` ON `student` (`local_nis`);--> statement-breakpoint
CREATE INDEX `idx_students_nisn` ON `student` (`nisn`);--> statement-breakpoint
CREATE INDEX `idx_students_student_name` ON `student` (`student_name`);--> statement-breakpoint
CREATE INDEX `idx_students_local_nis` ON `student` (`local_nis`);--> statement-breakpoint
CREATE TABLE `student_wali` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`nik` text,
	`name` text,
	`birth_place` text,
	`birth_date` text,
	`birth_year` integer,
	`education` text,
	`occupation` text,
	`monthly_income` real,
	`phone_number` text,
	`is_alive` integer DEFAULT 1,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_wali_student_id_unique` ON `student_wali` (`student_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_school_data` (
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
INSERT INTO `__new_school_data`("id", "name", "npsn", "nsm", "akreditasi", "alamat", "kota", "negara", "logoUrl") SELECT "id", "name", "npsn", "nsm", "akreditasi", "alamat", "kota", "negara", "logoUrl" FROM `school_data`;--> statement-breakpoint
DROP TABLE `school_data`;--> statement-breakpoint
ALTER TABLE `__new_school_data` RENAME TO `school_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX `class_subject_class_id_subject_id_unique`;