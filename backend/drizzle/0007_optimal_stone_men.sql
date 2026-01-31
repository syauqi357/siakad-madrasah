CREATE TABLE `school_facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`facilityType` text NOT NULL,
	`subFolder` text,
	`imagePath` text NOT NULL,
	`caption` text,
	`displayOrder` integer DEFAULT 0,
	`createdAt` integer DEFAULT 1769445379314
);
--> statement-breakpoint
DROP INDEX `idx_students_nisn`;--> statement-breakpoint
DROP INDEX `idx_students_student_name`;--> statement-breakpoint
DROP INDEX `idx_students_local_nis`;--> statement-breakpoint
ALTER TABLE `student_father` DROP COLUMN `family_card_number_id`;--> statement-breakpoint
ALTER TABLE `student_father` DROP COLUMN `religion`;--> statement-breakpoint
ALTER TABLE `student_mother` DROP COLUMN `family_card_number_id`;--> statement-breakpoint
ALTER TABLE `student_mother` DROP COLUMN `religion`;