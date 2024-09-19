import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import {
  NodotsGameInitializing,
  NodotsGameReady,
  NodotsColor,
  NodotsMoveDirection,
} from '../../backgammon-types'

export const ColorEnum = pgEnum('color', ['black', 'white'])
export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])

const gameKind = [
  'initializing',
  'ready',
  'rolling-for-start',
  'playing-rolling',
  'playing-moving',
] as const

export const GameTypeEnum = pgEnum('game-kind', gameKind)

export const GamesTable = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: GameTypeEnum('kind').notNull(),
  player1: jsonb('player1').notNull(),
  player2: jsonb('player2').notNull(),
  board: jsonb('board').notNull(),
  cube: jsonb('cube').notNull(),
  dice: jsonb('dice').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
export const dbCreateGame = async (
  gameInitializing: NodotsGameInitializing,
  db: NodePgDatabase<Record<string, never>>
) => {
  const game: typeof GamesTable.$inferInsert = {
    ...gameInitializing,
    kind: 'ready',
    player1: gameInitializing.players[0],
    player2: gameInitializing.players[1],
  }
  const result = await db.insert(GamesTable).values(game).returning()
  return result?.length === 1 ? result[0] : null
}

export const dbSetGameRolling = async (
  game: NodotsGameReady,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('dbSetGameRolling', game)
  return {
    ...game,
    kind: 'playing-rolling',
    activeColor,
  }
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
    console.error('No game found')
  }
  return game
}

export const dbGetReadyGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const games = await (await dbGetAll(db)).filter((g) => g.kind === 'ready')
  return games.length === 1 ? games[0] : null
}

export const dbGetGamesByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('dbGetGamesByPlayerId', playerId)
  const games = await db.select().from(GamesTable)
  // .where(
  //   or(eq(GamesTable.player1Id, playerId), eq(GamesTable.player2Id, playerId))
  // )
  console.log('games', games)
  return games
}
