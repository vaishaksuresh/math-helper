CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`question_id` text NOT NULL,
	`user_answer` text,
	`is_correct` integer,
	`answered_at` integer NOT NULL,
	`time_spent_seconds` integer,
	`hint_used` integer DEFAULT false NOT NULL,
	`solve_used` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL,
	`grade_preference` integer,
	`difficulty_preference` text,
	`theme` text DEFAULT 'dark' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`question_text` text NOT NULL,
	`question_type` text NOT NULL,
	`requires_paper` integer DEFAULT false NOT NULL,
	`choices` text NOT NULL,
	`correct_answer` text NOT NULL,
	`explanation` text NOT NULL,
	`hint` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`student_name` text,
	`grade_level` integer NOT NULL,
	`difficulty` text NOT NULL,
	`mode` text NOT NULL,
	`total_questions` integer,
	`time_limit_minutes` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`current_question_index` integer DEFAULT 0 NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`completed_at` integer,
	`last_active_at` integer NOT NULL,
	`topic` text,
	`subject` text DEFAULT 'math' NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
