CREATE TABLE `buildings_school` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`categoryId` integer NOT NULL,
	`subcategory` text NOT NULL,
	`condition` text DEFAULT 'baik',
	`quantity` integer DEFAULT 1,
	`acquisitionYear` integer,
	`acquisitionValue` integer,
	`location` text,
	`registrationNumber` text,
	`brand` text,
	`model` text,
	`serialNumber` text,
	`specifications` text,
	`description` text,
	`status` text DEFAULT 'aktif',
	`createdAt` integer DEFAULT 1771726528033,
	`updatedAt` integer DEFAULT 1771726528033
);
--> statement-breakpoint
CREATE TABLE `curriculum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`year` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `curriculum_code_unique` ON `curriculum` (`code`);--> statement-breakpoint
CREATE TABLE `student_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`rombel_id` integer,
	`scores` text,
	`status_type` text NOT NULL,
	`reason` text,
	`mutasi_type` text,
	`destination_school` text,
	`graduation_year` text,
	`certificate_number` text,
	`final_grade` text,
	`completion_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_name` text NOT NULL,
	`nisn` text NOT NULL,
	`local_nis` text,
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
	`status` text DEFAULT 'ACTIVE',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_student`("id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "rombel_id", "status", "created_at", "updated_at") SELECT "id", "student_name", "nisn", "local_nis", "gender", "religion", "birth_place", "birth_date", "previous_school", "phone_number", "child_order", "siblings_count", "origin_region", "bpjs", "id_card_number", "birth_certificate_number", "nationality", "living_with", "transportation", "profile_photo", "rombel_id", "status", "created_at", "updated_at" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `student_nisn_unique` ON `student` (`nisn`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_local_nis_unique` ON `student` (`local_nis`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_bpjs_unique` ON `student` (`bpjs`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_id_card_number_unique` ON `student` (`id_card_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_birth_certificate_number_unique` ON `student` (`birth_certificate_number`);--> statement-breakpoint
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
	`buildingId` integer,
	`createdAt` integer DEFAULT 1771726528068
);
--> statement-breakpoint
INSERT INTO `__new_school_facilities`("id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "buildingId", "createdAt") SELECT "id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "buildingId", "createdAt" FROM `school_facilities`;--> statement-breakpoint
DROP TABLE `school_facilities`;--> statement-breakpoint
ALTER TABLE `__new_school_facilities` RENAME TO `school_facilities`;--> statement-breakpoint
ALTER TABLE `rombel` ADD `kurikulum` text;--> statement-breakpoint
ALTER TABLE `rombel_students` ADD `is_active` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `rombel_students` ADD `left_at` text;--> statement-breakpoint
ALTER TABLE `subjects` ADD `description` text;--> statement-breakpoint
ALTER TABLE `subjects` ADD `kkm` integer DEFAULT 75;--> statement-breakpoint
CREATE UNIQUE INDEX `student_father_nik_unique` ON `student_father` (`nik`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_mother_nik_unique` ON `student_mother` (`nik`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_wali_nik_unique` ON `student_wali` (`nik`);