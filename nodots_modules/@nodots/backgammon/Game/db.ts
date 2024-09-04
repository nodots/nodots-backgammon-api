import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import {
  GameInitialized,
  GameInitializing,
  NodotsColor,
  NodotsGame,
  NodotsMoveDirection,
  NodotsPlayer,
} from '../../backgammon-types'

export const ColorEnum = pgEnum('color', ['black', 'white'])
export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])

const gameKind = [
  'game-initializing',
  'game-initialized',
  'game-rolling-for-start',
  'game-playing-rolling',
  'game-playing-moving',
  'game-completed',
] as const

export const GameTypeEnum = pgEnum('game-kind', gameKind)

export interface ActiveBackgammonPlayer {
  id: string
  kind: 'player-rolling' | 'player-moving' | 'player-waiting'
  color: NodotsColor
  direction: NodotsMoveDirection
}

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
  initializingGame: GameInitializing,
  db: NodePgDatabase<Record<string, never>>
) => {
  const game: typeof GamesTable.$inferInsert = {
    kind: 'game-initialized',
    player1: {
      ...initializingGame.players[0],
      kind: 'player-waiting',
    },
    player2: {
      ...initializingGame.players[1],
      kind: 'player-waiting',
    },
    board: initializingGame.board,
    cube: initializingGame.cube,
    dice: initializingGame.dice,
  }
  const result = await db.insert(GamesTable).values(game).returning()
  return result?.length === 1 ? result[0] : null
}

export const dbSetGameRolling = async (
  game: GameInitialized,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('dbSetGameRolling', game)
  return {
    ...game,
    kind: 'game-playing-rolling',
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

export const dbGetInitializedGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const games = await (
    await dbGetAll(db)
  ).filter((g) => g.kind === 'game-initialized')
  return games.length === 1 ? games[0] : null
}

export const dbGetInitializedGameById = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .select()
    .from(GamesTable)
    .where(
      and(eq(GamesTable.id, gameId), eq(GamesTable.kind, 'game-initialized'))
    )
    .limit(1)

export const dbGetGameByIdAndKind = async (
  gameId: string,
  kind:
    | 'game-initializing'
    | 'game-initialized'
    | 'game-rolling-for-start'
    | 'game-playing-rolling'
    | 'game-playing-moving'
    | 'game-completed',
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db
    .select()
    .from(GamesTable)
    .where(and(eq(GamesTable.id, gameId), eq(GamesTable.kind, kind)))
    .limit(1)
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
