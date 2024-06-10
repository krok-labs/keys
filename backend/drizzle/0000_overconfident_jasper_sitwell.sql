CREATE TABLE `allowed_keys` (
	`user_id` integer NOT NULL,
	`key_id` integer NOT NULL,
	`is_allowed` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`key_id`) REFERENCES `keys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `key_contract` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`key_id` integer NOT NULL,
	`state` text DEFAULT 'CURRENTLY_HOLDING' NOT NULL,
	`picked_up_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deposited_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`key_id`) REFERENCES `keys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nfc_id` integer NOT NULL,
	`description` text,
	`title` text NOT NULL,
	`floor` integer
);
--> statement-breakpoint
CREATE TABLE `temporary_keycards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`surname` text NOT NULL,
	`firstname` text NOT NULL,
	`middlename` text NOT NULL,
	`documents_scan_image` text NOT NULL,
	`person_scan_image` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	`deposited_at` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `key_contract_id_unique` ON `key_contract` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `keys_id_unique` ON `keys` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `temporary_keycards_id_unique` ON `temporary_keycards` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_aid_unique` ON `users` (`aid`);