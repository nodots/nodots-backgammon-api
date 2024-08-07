import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { generateId } from '..'
import { GameDbError } from './errors'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { NodotsPlayersReady } from '../Player'

export const GameTypeEnum = pgEnum('kind', [
  'game-initializing',
  'game-initialized',
  'game-rolling-for-start',
  'game-playing-rolling',
  'game-playing-moving',
  'game-completed',
])

export const GamesTable = pgTable('games', {
  id: uuid('id'),
  kind: GameTypeEnum('kind'),
  players: jsonb('players'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const create = async (
  players: NodotsPlayersReady,
  db: NodePgDatabase<Record<string, never>>
) => {
  if (!players.black || !players.white) {
    throw Error('[DB] Both players must be ready to initialize a game')
  }
  const game: typeof GamesTable.$inferInsert = {
    id: generateId(),
    kind: 'game-initialized',
    players,
  }
  console.log('[Game: db] create game:', game)
  return await db.insert(GamesTable).values(game).returning()
}

export const getAll = async (db: NodePgDatabase<Record<string, never>>) => {
  return await db.select().from(GamesTable)
}
