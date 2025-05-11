import { eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { isValidUuid } from 'nodots-backgammon-core'
import {
  BackgammonColor,
  BackgammonGame,
  BackgammonGameRolledForStart,
  BackgammonGameStateKind,
  BackgammonMoveDirection,
} from 'nodots-backgammon-types'
import { GameStateError } from '../types/error'

const GAME_ROLLING_FOR_START = 'rolling-for-start' as BackgammonGameStateKind
const GAME_ROLLED_FOR_START = 'rolled-for-start' as BackgammonGameStateKind

export const GameTypeEnum = pgEnum('game_type', [
  'rolling-for-start',
  'rolled-for-start',
  'rolling',
  'rolled',
  'moving',
  'moved',
  'completed',
])

const BLACK = 'black' as BackgammonColor
const WHITE = 'white' as BackgammonColor

export const ColorEnum = pgEnum('color', ['black', 'white'])

const CLOCKWISE = 'clockwise' as BackgammonMoveDirection
const COUNTERCLOCKWISE = 'counterclockwise' as BackgammonMoveDirection

export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])

export const GamesTable = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  stateKind: GameTypeEnum('kind').notNull(),
  players: jsonb('players').notNull(),
  board: jsonb('board').notNull(),
  cube: jsonb('cube').notNull(),
  winner: jsonb('winner'),
  activeColor: ColorEnum('active_color'),
  activePlay: jsonb('active_play'),
  activePlayer: jsonb('active_player'),
  inactivePlayer: jsonb('inactive_player'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// NOTE: playerId in players JSONB array should reference UsersTable.id (foreign key relationship to be enforced at application level)

export const dbCreateGame = async (
  gameInitializing: BackgammonGame,
  db: NodePgDatabase<Record<string, never>>
): Promise<BackgammonGameRolledForStart> => {
  // Check that both playerIds exist in the users table
  const playerIds = [
    gameInitializing.players[0].id,
    gameInitializing.players[1].id,
  ]
  const users = await db.execute(
    sql`SELECT id FROM users WHERE id = ${playerIds[0]} OR id = ${playerIds[1]}`
  )
  if (!users.rows || users.rows.length !== 2) {
    throw GameStateError(
      '[Game API DB] dbCreateGame: One or both playerIds do not exist in users table'
    )
  }
  const game: typeof GamesTable.$inferInsert = {
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
    board: gameInitializing.board,
    cube: gameInitializing.cube,
    winner: gameInitializing.winner,
    activeColor: gameInitializing.activeColor,
    activePlay: gameInitializing.activePlay,
    activePlayer: gameInitializing.activePlayer,
    inactivePlayer: gameInitializing.inactivePlayer,
    // createdAt and updatedAt are handled by defaultNow()
  }
  console.log('[dbCreateGame] Inserting game:', game)
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

export const dbUpdateGame = async (
  game: BackgammonGame,
  db: NodePgDatabase<Record<string, never>>
) => {
  const gameId = game.id
  const updated = await db
    .update(GamesTable)
    .set({
      stateKind: game.stateKind,
      players: [
        {
          playerId: game.players[0].id,
          color: game.players[0].color,
          direction: game.players[0].direction,
          pipCount: game.players[0].pipCount,
        },
        {
          playerId: game.players[1].id,
          color: game.players[1].color,
          direction: game.players[1].direction,
          pipCount: game.players[1].pipCount,
        },
      ],
      board: game.board,
      cube: game.cube,
      winner: game.winner,
      activeColor: game.activeColor,
      activePlay: game.activePlay,
      activePlayer: game.activePlayer,
      inactivePlayer: game.inactivePlayer,
    })
    .where(eq(GamesTable.id, gameId))
    .returning()
  if (!updated.length) throw new Error('Game not updated')
  return updated[0]
}
