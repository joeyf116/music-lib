CREATE TABLE "library_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"instrument" text NOT NULL,
	"strings" integer NOT NULL,
	"tuning" text NOT NULL,
	"root" text,
	"scale_type" text,
	"chord_type" text,
	"position" text,
	"fret_range" jsonb,
	"difficulty" text,
	"tab" text,
	"diagram" jsonb,
	"formula" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"song_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"practice_goal" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"key" text,
	"capo" text,
	"tuning" text,
	"difficulty" text,
	"instrument_focus" text DEFAULT 'guitar' NOT NULL,
	"spotify_url" text,
	"tab_url" text,
	"youtube_url" text,
	"chord_progression" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"practice_status" text DEFAULT 'wantToLearn' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
