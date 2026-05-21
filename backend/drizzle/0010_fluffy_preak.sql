PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_buildings_school` (
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
	`createdAt` integer DEFAULT 1779358723454,
	`updatedAt` integer DEFAULT 1779358723454
);
--> statement-breakpoint
INSERT INTO `__new_buildings_school`("id", "name", "categoryId", "subcategory", "condition", "quantity", "acquisitionYear", "acquisitionValue", "location", "registrationNumber", "brand", "model", "serialNumber", "specifications", "description", "status", "createdAt", "updatedAt") SELECT "id", "name", "categoryId", "subcategory", "condition", "quantity", "acquisitionYear", "acquisitionValue", "location", "registrationNumber", "brand", "model", "serialNumber", "specifications", "description", "status", "createdAt", "updatedAt" FROM `buildings_school`;--> statement-breakpoint
DROP TABLE `buildings_school`;--> statement-breakpoint
ALTER TABLE `__new_buildings_school` RENAME TO `buildings_school`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_school_facilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`facilityType` text NOT NULL,
	`subFolder` text,
	`imagePath` text NOT NULL,
	`caption` text,
	`displayOrder` integer DEFAULT 0,
	`buildingId` integer,
	`createdAt` integer DEFAULT 1779358723675
);
--> statement-breakpoint
INSERT INTO `__new_school_facilities`("id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "buildingId", "createdAt") SELECT "id", "facilityType", "subFolder", "imagePath", "caption", "displayOrder", "buildingId", "createdAt" FROM `school_facilities`;--> statement-breakpoint
DROP TABLE `school_facilities`;--> statement-breakpoint
ALTER TABLE `__new_school_facilities` RENAME TO `school_facilities`;