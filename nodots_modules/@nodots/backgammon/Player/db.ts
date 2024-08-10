import { PlayerKnocking, PlayerReady, PlayerSeekingGame } from '.'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { generateId, INodotsPlayer } from '..'
import {
  jsonb,
  pgEnum,
  pgTable,
  PgUUID,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { NodotsColor, NodotsMoveDirection } from '../Game'
import { ColorEnum, DirectionEnum } from '../Game/db'

export const PlayerTypeEnum = pgEnum('player-kind', [
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
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: PlayerTypeEnum('kind'),
  externalId: text('external_id').unique().notNull(),
  email: text('email').unique(),
  color: ColorEnum('color') || undefined,
  direction: DirectionEnum('direction') || undefined,
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// // Create
export const dbCreatePlayer = async (
  incomingPlayer: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => {
  const player: typeof PlayersTable.$inferInsert = {
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
) => await db.select().from(PlayersTable)

export const dbFetchPlayer = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db.select().from(PlayersTable).where(eq(PlayersTable.id, id)).limit(1)

// Specialized read
export const dbFetchPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .select()
    .from(PlayersTable)
    .where(eq(PlayersTable.kind, 'player-seeking-game'))

export const dbFetchPlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  db.select().from(PlayersTable).where(eq(PlayersTable.email, email)).limit(1)

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
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const updatedPlayer = await db
    .update(PlayersTable)
    .set({
      kind: 'player-seeking-game',
    })
    .where(eq(PlayersTable.id, id))
    .returning()

  return updatedPlayer
}

export interface ISetPlayerReady {
  id: string
  color: NodotsColor
  direction: NodotsMoveDirection
  db: NodePgDatabase<Record<string, never>>
}

export const dbSetPlayerReady = async ({
  id,
  color,
  direction,
  db,
}: ISetPlayerReady) => {
  console.log('[dbSetPlayerReady] id:', id)
  console.log('[dbSetPlayerReady] color:', color)
  console.log('[dbSetPlayerReady] direction:', direction)

  return await db
    .update(PlayersTable)
    .set({
      kind: 'player-ready',
      color,
      direction,
    })
    .where(eq(PlayersTable.id, id))
    .returning({ updated: PlayersTable })
}
