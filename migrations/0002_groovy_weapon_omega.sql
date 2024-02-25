CREATE TABLE `repository` (
	`id` text PRIMARY KEY NOT NULL,
	`fk_user` text NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`latest_seen_release` text,
	FOREIGN KEY (`fk_user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
