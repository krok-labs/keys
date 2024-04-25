CREATE TABLE `temporaryKeycards` (
	`documents_scan_image` blob NOT NULL,
	`person_scan_image` blob,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `allowedKeys` RENAME COLUMN `created_date` TO `created_at`;