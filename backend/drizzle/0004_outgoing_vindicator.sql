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
CREATE UNIQUE INDEX `class_subject_class_id_subject_id_unique` ON `class_subject` (`class_id`,`subject_id`);--> statement-breakpoint
CREATE TABLE `rombel` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`class_id` integer NOT NULL,
	`academic_year_id` integer NOT NULL,
	`class_advisor_id` integer,
	`student_capacity` integer DEFAULT 30,
	`classroom` text,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_advisor_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rombel_code_unique` ON `rombel` (`code`);--> statement-breakpoint
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
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subject_code` text
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
DROP TABLE `school_data`;--> statement-breakpoint
DROP TABLE `studentAddress`;--> statement-breakpoint
DROP TABLE `student`;