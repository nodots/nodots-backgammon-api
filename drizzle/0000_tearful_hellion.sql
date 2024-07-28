CREATE TABLE IF NOT EXISTS "player" (
	"id" serial NOT NULL,
	"email" text,
	"locale" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
