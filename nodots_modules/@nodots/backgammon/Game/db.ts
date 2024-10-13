import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, sql, SQL, SQLWrapper } from 'drizzle-orm'
import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { NodotsGameInitialized } from '../../backgammon-types'
import { isValidUuid } from '../../backgammon-types/utils'

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
  if (gameInitialized.players.length !== 2) {
    return console.error(
      '[Game API DB] dbCreateGame Invalid number of players:',
      gameInitialized.players.length
    )
  }
  if (
    gameInitialized.players[0].playerId === gameInitialized.players[1].playerId
  ) {
    return console.error(
      '[Game API DB] dbCreateGame player1Id === player2Id:',
      gameInitialized.players[0].playerId
    )
  }
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

/* 
.where(sql`${databaseSchema.products.properties} ->> 'brand' = 'Audi'`);

.where(sql`players->1->>'playerId' = '1c1e5bf5-77a0-4381-a35d-8aa00d94660b'
OR
players->0->>'playerId' = '1c1e5bf5-77a0-4381-a35d-8aa00d94660b'`);


players->1->>'playerId' = '1c1e5bf5-77a0-4381-a35d-8aa00d94660b' 
OR
players->0->>'playerId' = '1c1e5bf5-77a0-4381-a35d-8aa00d94660b'
*/
