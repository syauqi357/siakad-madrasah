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
