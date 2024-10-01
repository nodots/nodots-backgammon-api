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
  players: jsonb('players').notNull(),
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
    players: [
      {
        playerId: gameInitialized.players[0].playerId,
        color: gameInitialized.players[0].color,
        direction: gameInitialized.players[0].direction,
        pipCount: gameInitialized.players[0].pipCount,
      },
      {
        playerId: gameInitialized.players[1].playerId,
        color: gameInitialized.players[1].color,
        direction: gameInitialized.players[1].direction,
        pipCount: gameInitialized.players[1].pipCount,
      },
    ],
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

// FIXME will not work with new db schema
// ATM players can only have one active game. But this is not enforced in the db
export const dbGetActiveGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  // FIXME: Not loving using 'sql' but drizzle seems to still have problems w jsonb
  const result = await db.execute(
    sql`SELECT * FROM games WHERE player1->'player'->>'id' = ${playerId} OR player2->'player'->>'id' = ${playerId} LIMIT 1`
  )
  return result?.rows?.length === 1 ? result.rows[0] : null
}

// SELECT * FROM table WHERE json_field->>'Name' = 'mike' AND json_field->>'Location' = 'Lagos'
