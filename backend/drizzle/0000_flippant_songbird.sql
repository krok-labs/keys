CREATE TABLE `allowed_keys` (
	`user_id` integer NOT NULL,
	`key_id` integer NOT NULL,
	`is_allowed` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`key_id`) REFERENCES `keys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nfc_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `temporary_keycards` (
	`documents_scan_image` blob NOT NULL,
	`person_scan_image` blob,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keys_id_unique` ON `keys` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);