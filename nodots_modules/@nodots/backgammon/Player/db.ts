import { NodotsPlayer, PlayerInitialized, PlayerKnocking, PlayerReady } from '.'
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

// // Create
export const dbCreatePlayer = async (
  incomingPlayer: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => {
  const playerType = typeof PlayersTable.$inferInsert
  console.log('playerType:', playerType)
  const player: typeof PlayersTable.$inferInsert = {
    id: generateId(),
    kind: 'player-initialized',
    externalId:
      incomingPlayer.externalId ||
      `${incomingPlayer.source}:${incomingPlayer.email}`,
    email: incomingPlayer.email,
    preferences: incomingPlayer.preferences,
  }
  const result = await db.insert(PlayersTable).values(player).returning()

  return result
}

// Read
export const dbFetchPlayers = async (
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db.select().from(PlayersTable)
}

export const dbFetchPlayer = async (
  playerId: PgUUID<any>, // FIXME: wrong data type
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayer> => {
  const players = await db
    .select()
    .from(PlayersTable)
    .where(eq(PlayersTable.id, playerId))
    .limit(1)

  const player = players[0]

  if (!player) throw PlayerDbError('No player found for id')

  switch (player.kind) {
    case 'player-knocking':
    case 'player-playing-moving':
    case 'player-playing-rolling':
    case 'player-playing-waiting':
    case 'player-rolling-for-start':
      break
    case 'player-initialized':
    case 'player-seeking-game':
    case 'player-ready':
      return {
        ...player,
        id: player.id as string, // FIXME
        kind: player.kind,
        email: player.email as string, // FIXME
        externalId: player.externalId as string, // FIXME
        preferences: player.preferences as Record<string, unknown>, // FIXME
        source: 'unknown', // FIXME
      }
  }
}

// Specialized read
export const dbFetchPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db
    .select()
    .from(PlayersTable)
    .where(eq(PlayersTable.kind, 'player-seeking-game'))
}

// Delete
// export const dbDestroyPlayers = async (
//   db: NodePgDatabase<Record<string, never>>[]
// ) =>
//   db.map(
//     async (record) =>
//       await record
//         .delete(PlayersTable)
//         .returning({ deleted: PlayersTable.email })
//   )

// export const dbDestroyPlayer = async (
//   db: NodePgDatabase<Record<string, never>>[],
//   playerId: PgUUID<any> // FIXME: wrong data type
// ) =>
//   db.map(
//     async (record) =>
//       await record
//         .delete(PlayersTable)
//         .where(eq(PlayersTable.id, playerId))
//         .returning({ deleted: PlayersTable.email })
//   )

// Specialized update
export const dbSetPlayerSeekingGame = async (
  uuid: PgUUID<any>, // FIXME
  db: NodePgDatabase<Record<string, never>>
) => {
  const initializedPlayer = await db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.id, uuid),
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

export const dbSetPlayerReady = async (
  uuid: PgUUID<any>, // FIXME
  db: NodePgDatabase<Record<string, never>>
) => {
  // const playerType = typeof PlayersTable.$inferInsert
  return await db
    .update(PlayersTable)
    .set({ kind: 'player-ready' })
    .where(eq(PlayersTable.id, uuid))
    .returning({ PlayersTable })
}
