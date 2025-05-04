import { eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { isValidUuid } from '../../nodots_modules/@nodots/nodots-backgammon-core/src'
import {
  BackgammonColor,
  BackgammonGame,
  BackgammonGameRolledForStart,
  BackgammonGameStateKind,
  BackgammonMoveDirection,
} from '../../nodots_modules/@nodots/nodots-backgammon-core/src/types'
import { GameStateError } from '../types/error'

const GAME_ROLLING_FOR_START = 'rolling-for-start' as BackgammonGameStateKind
const GAME_ROLLED_FOR_START = 'rolled-for-start' as BackgammonGameStateKind
const GAME_ROLLING = 'rolling' as BackgammonGameStateKind
const GAME_MOVING = 'moving' as BackgammonGameStateKind
const GAME_COMPLETED = 'completed' as BackgammonGameStateKind

export const GameTypeEnum = pgEnum('game_type', [
  GAME_ROLLING_FOR_START,
  GAME_ROLLED_FOR_START,
  GAME_ROLLING,
  GAME_MOVING,
  GAME_COMPLETED,
])

const BLACK = 'black' as BackgammonColor
const WHITE = 'white' as BackgammonColor

export const ColorEnum = pgEnum('color', [BLACK, WHITE])

const CLOCKWISE = 'clockwise' as BackgammonMoveDirection
const COUNTERCLOCKWISE = 'counterclockwise' as BackgammonMoveDirection

export const DirectionEnum = pgEnum('direction', [CLOCKWISE, COUNTERCLOCKWISE])

export const GamesTable = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  stateKind: GameTypeEnum('kind').notNull(),
  players: jsonb('players').notNull(),
  board: jsonb('board').notNull(),
  cube: jsonb('cube').notNull(),
  winner: jsonb('winner'),
  activeColor: ColorEnum('active_color'),
  activePlay: jsonb('active_play'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dbCreateGame = async (
  gameInitializing: BackgammonGame,
  db: NodePgDatabase<Record<string, never>>
): Promise<BackgammonGameRolledForStart> => {
  const game: typeof GamesTable.$inferInsert = {
    ...gameInitializing,
    stateKind: gameInitializing.stateKind,
    players: [
      {
        playerId: gameInitializing.players[0].id,
        color: gameInitializing.players[0].color,
        direction: gameInitializing.players[0].direction,
        pipCount: gameInitializing.players[0].pipCount,
      },
      {
        playerId: gameInitializing.players[1].id,
        color: gameInitializing.players[1].color,
        direction: gameInitializing.players[1].direction,
        pipCount: gameInitializing.players[1].pipCount,
      },
    ],
  }
  const result = await db.insert(GamesTable).values(game).returning()
  if (result.length !== 1) {
    throw GameStateError('[Game API DB] dbCreateGame: Game not created')
  }
  return result[0] as unknown as BackgammonGameRolledForStart
}

export const dbGetAll = async (db: NodePgDatabase<Record<string, never>>) =>
  await db.select().from(GamesTable)

export const dbGetGame = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  if (!isValidUuid(gameId)) {
    return console.error('[Game API DB] dbGetGame Invalid gameId:', gameId)
  }
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

// '9b311cbb-e0d2-4d7b-ad91-b629aa2c7612'
// ATM players can only have one active game. But this is not enforced in the db
export const dbGetActiveGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  // FIXME: Not loving using 'sql' but drizzle seems to still have problems w jsonb

  const result = await db.execute(
    sql`SELECT * FROM games WHERE players->0->>'playerId' = ${playerId} OR players->1->>'playerId' = ${playerId}`
  )
  console.log(
    `[Game API Db] dbGetActiveGameByPlayerId ${playerId} result:`,
    result.rows
  )
  return result.rows
}
