import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { generateId } from '..'
import { GameDbError } from './errors'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { NodotsPlayersReady } from '../Player'
import { GameInitialized, GameInitializing } from '.'

export const GameTypeEnum = pgEnum('game-kind', [
  'game-initializing',
  'game-initialized',
  'game-rolling-for-start',
  'game-playing-rolling',
  'game-playing-moving',
  'game-completed',
])

export const ColorEnum = pgEnum('color', ['black', 'white'])
export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])

export const GamesTable = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: GameTypeEnum('kind'),
  player1Id: uuid('player1_id').notNull(),
  player2Id: uuid('player2_id').notNull(),
  board: jsonb('board').notNull(),
  cube: jsonb('cube').notNull(),
  dice: jsonb('dice').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dbCreateGame = async (
  game: GameInitialized,
  db: NodePgDatabase<Record<string, never>>
) => {
  const normalizedGame = {
    ...game,
    player1Id: game.players.black.id,
    player2Id: game.players.white.id,
    board: JSON.stringify(game.board),
    cube: JSON.stringify(game.cube),
    dice: JSON.stringify(game.dice),
  }
  return await db.insert(GamesTable).values(normalizedGame).returning({
    id: GamesTable.id,
    kind: GamesTable.kind,
    player1Id: GamesTable.player1Id,
    player2Id: GamesTable.player2Id,
    board: GamesTable.board,
    cube: GamesTable.cube,
    dice: GamesTable.dice,
  })
}

export const dbGetAll = async (db: NodePgDatabase<Record<string, never>>) =>
  await db.select().from(GamesTable)

export const dbGetGame = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const game = await db
    .select()
    .from(GamesTable)
    .where(eq(GamesTable.id, gameId))
    .limit(1)
  if (!game) {
    throw GameDbError(`Game not found: ${gameId}`)
  }
  return game
}
