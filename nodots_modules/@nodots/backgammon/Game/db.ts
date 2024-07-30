import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { generateId } from '..'
import { GameDbError } from './errors'
import {
  jsonb,
  pgEnum,
  pgTable,
  PgUUID,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const GameTypeEnum = pgEnum('kind', [
  'game-initializing',
  'game-rolling-for-start',
  'game-playing-rolling',
  'game-playing-moving',
  'game-initialized',
  'game-completed',
])

export const GamesTable = pgTable('games', {
  id: uuid('id'),
  kind: GameTypeEnum('kind'),
  players: jsonb('players'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const getAll = async (db: NodePgDatabase<Record<string, never>>) => {
  return await db.select().from(GamesTable)
}
