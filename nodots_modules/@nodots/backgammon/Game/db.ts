import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, sql } from 'drizzle-orm'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import {
  NodotsGameReady,
  NodotsColor,
  NodotsGameInitialized,
} from '../../backgammon-types'

export const ColorEnum = pgEnum('color', ['black', 'white'])
export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])

const gameKind = ['rolling-for-start', 'rolling', 'moving'] as const

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
  gameInitialized: NodotsGameInitialized,
  db: NodePgDatabase<Record<string, never>>
) => {
  const game: typeof GamesTable.$inferInsert = {
    ...gameInitialized,
    kind: 'rolling-for-start',
    player1: {
      player: gameInitialized.players.black.player,
      attributes: {
        color: 'black',
        direction: gameInitialized.players.black.attributes.direction,
        pipCount: 167,
      },
    },
    player2: {
      player: gameInitialized.players.white.player,
      attributes: {
        color: 'white',
        direction: gameInitialized.players.white.attributes.direction,
        pipCount: 167,
      },
    },
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
    kind: 'rolling',
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

export const dbGetNewGamesByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const games = await (
    await dbGetAll(db)
  ).filter((g) => g.kind === 'rolling-for-start')
  return games.length === 1 ? games[0] : null
}

// ATM players can only have one active game. But this is not enforced in the db
export const dbGetActiveGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const where = sql`player1 @> '{"player":{"id": "\${playerId}"}}' OR player2 @> '{"player":{"id": "\${playerId}"}}'`
  const activeGame = await db
    .select()
    .from(GamesTable)
    .where(sql`${where}`)
    .limit(1)
  console.log(`[Game Db] dbGetActiveGameByPlayerId ${playerId}`, activeGame)
  return activeGame
}

// SELECT * FROM table WHERE json_field->>'Name' = 'mike' AND json_field->>'Location' = 'Lagos'
