import {
  serial,
  text,
  timestamp,
  pgTable,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const PlayerTypeEnum = pgEnum('kind', [
  'player-incoming',
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
  locale: text('locale'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
