DO $$ BEGIN
 CREATE TYPE "public"."kind" AS ENUM('player-incoming', 'player-initializing', 'player-rolling-for-start', 'player-rolling', 'player-moving', 'player-waiting', 'player-winning');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial NOT NULL,
	"kind" "kind",
	"external_id" text,
	"email" text,
	"locale" text,
	"preferences" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp
);
