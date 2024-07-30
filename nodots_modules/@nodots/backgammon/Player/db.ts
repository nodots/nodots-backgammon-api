import { PlayerInitialized, PlayerKnocking } from '.'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { generateId } from '..'
import { PlayerDbError } from './errors'
import {
  jsonb,
  pgEnum,
  pgTable,
  PgUUID,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const PlayerTypeEnum = pgEnum('kind', [
  'player-knocking',
  'player-initialized',
  'player-seeking-game',
  'player-ready',
  'player-rolling-for-start',
  'player-playing-rolling',
  'player-playing-moving',
  'player-playing-waiting',
])

export const PlayersTable = pgTable('players', {
  id: uuid('id'),
  kind: PlayerTypeEnum('kind'),
  externalId: text('external_id').unique().notNull(),
  email: text('email').unique(),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const getAll = async (db: NodePgDatabase<Record<string, never>>) => {
  return await db.select().from(PlayersTable)
}

export const getSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db
    .select()
    .from(PlayersTable)
    .where(eq(PlayersTable.kind, 'player-seeking-game'))
}

export const create = async (
  incomingPlayer: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => {
  const player: typeof PlayersTable.$inferInsert = {
    id: generateId(),
    kind: 'player-initialized',
    externalId:
      incomingPlayer.externalId ||
      `${incomingPlayer.source}:${incomingPlayer.email}`,
    email: incomingPlayer.email,
    preferences: incomingPlayer.preferences,
  }
  return await db.insert(PlayersTable).values(player).returning()
}

export const setSeekingGame = async (
  playerId: PgUUID<any>, // FIXME: wrong data type
  db: NodePgDatabase<Record<string, never>>
) => {
  const initializedPlayer = await db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.id, playerId),
        eq(PlayersTable.kind, 'player-initialized')
      )
    )
    .limit(1)

  const incomingPlayer = initializedPlayer[0]

  if (!incomingPlayer)
    return PlayerDbError('No initialized player found for id')

  switch (incomingPlayer.kind) {
    case 'player-initialized':
      return await db
        .update(PlayersTable)
        .set({ kind: 'player-seeking-game' })
        .where(
          and(
            eq(PlayersTable.id, incomingPlayer.id as string), // FIXME
            eq(PlayersTable.kind, 'player-initialized')
          )
        )
        .returning({ player: PlayersTable })
    case 'player-seeking-game':
    case 'player-ready':
      console.error('Player is already seeking game or ready')
  }
}

export const setReady = async (
  playerInitialized: PlayerInitialized,
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db
    .update(PlayersTable)
    .set({ kind: 'player-ready' })
    .where(eq(PlayersTable.id, playerInitialized.id))
    .returning()
}
