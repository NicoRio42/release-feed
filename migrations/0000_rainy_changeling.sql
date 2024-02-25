CREATE TABLE `access_token` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expiration_date` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `refresh_token` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`github_id` text,
	`profile` text DEFAULT 'simple' NOT NULL,
	`registration_date` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_token_user_id_provider_unique` ON `access_token` (`user_id`,`provider`);--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_token_user_id_provider_unique` ON `refresh_token` (`user_id`,`provider`);