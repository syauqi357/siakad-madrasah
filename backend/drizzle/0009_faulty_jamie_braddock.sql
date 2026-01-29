PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_school_facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`facilityType` text NOT NULL,
	`subFolder` text,
	`imagePath` text NOT NULL,
	`caption` text,
	`displayOrder` integer DEFAULT 0,
	`createdAt` integer DEFAULT 1769700011905
);
--> statement-breakpoint
INSERT INTO `__new_school_facilities`("id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "createdAt") SELECT "id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "createdAt" FROM `school_facilities`;--> statement-breakpoint
DROP TABLE `school_facilities`;--> statement-breakpoint
ALTER TABLE `__new_school_facilities` RENAME TO `school_facilities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_student_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`rombel_id` integer,
	`scores` text,
	`status_type` text NOT NULL,
	`reason` text,
	`mutasi_type` text,
	`destination_school` text,
	`completion_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rombel_id`) REFERENCES `rombel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_student_history`("id", "student_id", "rombel_id", "scores", "status_type", "reason", "mutasi_type", "destination_school", "completion_date", "created_at") SELECT "id", "student_id", "rombel_id", "scores", "status_type", "reason", "mutasi_type", "destination_school", "completion_date", "created_at" FROM `student_history`;--> statement-breakpoint
DROP TABLE `student_history`;--> statement-breakpoint
ALTER TABLE `__new_student_history` RENAME TO `student_history`;