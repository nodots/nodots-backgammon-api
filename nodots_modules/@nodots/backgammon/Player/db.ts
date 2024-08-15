import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and, or } from 'drizzle-orm'
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { ColorEnum, DirectionEnum } from '../Game/db'
import { Auth0User } from '../../../../src/routes/player'
import {
  NodotsColor,
  NodotsMoveDirection,
  PlayerKnocking,
} from '../../backgammon-types'

const playerKinds = [
  'player-knocking',
  'player-initialized',
  'player-seeking-game',
  'player-playing-rolling',
  'player-playing-moving',
  'player-playing-ready',
] as const

export const PlayerTypeEnum = pgEnum('player-kind', playerKinds)

export const PlayersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: PlayerTypeEnum('kind'),
  source: text('source'),
  externalId: text('external_id').unique(),
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

export const dbCreatePlayerFromAuth0User = async (
  user: Auth0User,
  db: NodePgDatabase<Record<string, never>>
) => {
  if (!user.sub) {
    throw new Error('No sub in Auth0 user')
  }
  const [source, externalId] = user.sub?.split('|')
  const player: typeof PlayersTable.$inferInsert = {
    kind: 'player-initialized',
    source,
    externalId,
    email: user.email,
  }
  console.log(player)
  const result = await db.insert(PlayersTable).values(player).returning()
  return result
}

// Read
export const dbGetPlayers = async (db: NodePgDatabase<Record<string, never>>) =>
  await db.select().from(PlayersTable)

export const dbGetPlayerById = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db.select().from(PlayersTable).where(eq(PlayersTable.id, id)).limit(1)

// Specialized read
export const dbGetPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .select()
    .from(PlayersTable)
    .where(eq(PlayersTable.kind, 'player-seeking-game'))

export const dbGetPlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  db.select().from(PlayersTable).where(eq(PlayersTable.email, email)).limit(1)

export const dbGetActivePlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.email, email),
        or(
          eq(PlayersTable.kind, 'player-playing-ready'),
          eq(PlayersTable.kind, 'player-playing-rolling'),
          eq(PlayersTable.kind, 'player-playing-moving')
        )
      )
    )
    .limit(1)

export const dbGetPlayerBySourceAndExternalId = async (
  source: string,
  externalId: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.externalId, externalId),
        eq(PlayersTable.source, 'player-knocking')
      )
    )
    .limit(1)
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
      kind: 'player-playing-ready',
      color,
      direction,
    })
    .where(eq(PlayersTable.id, id))
    .returning({ updated: PlayersTable })
}

export interface ISetPlayerState {
  id: string
  db: NodePgDatabase<Record<string, never>>
}

export const dbSetPlayerRolling = async ({ id, db }: ISetPlayerState) => {
  console.log('[dbSetPlayerReady] id:', id)

  return await db
    .update(PlayersTable)
    .set({
      kind: 'player-playing-rolling',
    })
    .where(eq(PlayersTable.id, id))
    .returning({ playerRolling: PlayersTable })
}
