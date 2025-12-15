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