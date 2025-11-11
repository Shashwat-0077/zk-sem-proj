CREATE TABLE `users` (
	`id` real PRIMARY KEY NOT NULL,
	`full_name` text,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);