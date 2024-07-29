import {
  serial,
  text,
  timestamp,
  pgTable,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const PlayerTypeEnum = pgEnum('kind', [
  'player-knocking',
  'player-ready',
  'player-initializing',
  'player-rolling-for-start',
  'player-rolling',
  'player-moving',
  'player-waiting',
  'player-winning',
])

export const players = pgTable('players', {
  id: serial('id'),
  kind: PlayerTypeEnum('kind'),
  externalId: text('external_id'),
  email: text('email'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
