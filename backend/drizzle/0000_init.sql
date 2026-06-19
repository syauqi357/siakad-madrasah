CREATE TABLE `academic_year` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start_year` integer,
	`end_year` integer,
	`start_date` text,
	`end_date` text,
	`is_active` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `academic_year_name_unique` ON `academic_year` (`name`);--> statement-breakpoint
CREATE TABLE `assessment_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`default_weight` integer,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assessment_type_code_unique` ON `assessment_type` (`code`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`audit_type` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`target` text,
	`status` text NOT NULL,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
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
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `class_subject` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`teacher_id` integer,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rombel` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`class_id` integer NOT NULL,
	`academic_year_id` integer NOT NULL,
	`class_advisor_id` integer,
	`student_capacity` integer DEFAULT 30,
	`classroom` text,
	`kurikulum` text,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_advisor_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rombel_code_unique` ON `rombel` (`code`);--> statement-breakpoint
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
CREATE TABLE `rombel_students` (
	`rombel_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`is_active` integer DEFAULT true,
	`left_at` text,
	PRIMARY KEY(`rombel_id`, `student_id`),
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
CREATE TABLE `school_facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`facilityType` text NOT NULL,
	`subFolder` text,
	`imagePath` text NOT NULL,
	`caption` text,
	`displayOrder` integer DEFAULT 0,
	`buildingId` integer,
	`createdAt` integer DEFAULT (unixepoch())
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
CREATE UNIQUE INDEX `student_father_nik_unique` ON `student_father` (`nik`);--> statement-breakpoint
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
CREATE TABLE `student_mother` (
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
CREATE UNIQUE INDEX `student_mother_student_id_unique` ON `student_mother` (`student_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_mother_nik_unique` ON `student_mother` (`nik`);--> statement-breakpoint
CREATE TABLE `student_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`class_subject_id` integer NOT NULL,
	`assessment_type_id` integer NOT NULL,
	`score` real NOT NULL,
	`assessment_date` text DEFAULT CURRENT_DATE,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_subject_id`) REFERENCES `class_subject`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assessment_type_id`) REFERENCES `assessment_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_student_assessment` ON `student_scores` (`student_id`,`class_subject_id`,`assessment_type_id`);--> statement-breakpoint
CREATE TABLE `student` (
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
CREATE UNIQUE INDEX `student_nisn_unique` ON `student` (`nisn`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_local_nis_unique` ON `student` (`local_nis`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_bpjs_unique` ON `student` (`bpjs`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_id_card_number_unique` ON `student` (`id_card_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_birth_certificate_number_unique` ON `student` (`birth_certificate_number`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `student_wali_nik_unique` ON `student_wali` (`nik`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subject_code` text,
	`description` text,
	`kkm` integer DEFAULT 75
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_name_unique` ON `subjects` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_subject_code_unique` ON `subjects` (`subject_code`);--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`nip` text,
	`full_name` text NOT NULL,
	`gender` text,
	`birth_place` text,
	`birth_date` text,
	`religion` text,
	`phone_number` text,
	`personal_email` text,
	`profile_photo` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_user_id_unique` ON `teachers` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_nip_unique` ON `teachers` (`nip`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`nama_lengkap` text,
	`nip` text,
	`jabatan` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);