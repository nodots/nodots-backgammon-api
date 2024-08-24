import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserInfoResponse as Auth0User } from 'auth0'
import { eq, and, or, ne } from 'drizzle-orm'
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import {
  PlayerKnocking,
  NodotsPlayerSeekingGame,
  NodotsPlayer,
  NodotsPlayerInitialized,
  NodotsPlayerPlaying,
} from '../../backgammon-types'

const playerKinds = [
  'player-incoming',
  'player-initialized',
  'player-seeking-game',
  'player-playing',
] as const

export const PlayerTypeEnum = pgEnum('player-kind', playerKinds)

export const PlayersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: PlayerTypeEnum('kind'),
  source: text('source'),
  externalId: text('external_id').unique(),
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
  await db
    .select()
    .from(PlayersTable)
    .where(
      and(eq(PlayersTable.id, id), ne(PlayersTable.kind, 'player-incoming'))
    )
    .limit(1)

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
        eq(PlayersTable.kind, 'player-playing')
      )
    )
    .limit(1)

export const dbGetPlayerBySourceAndExternalId = async (
  source: string,
  externalId: string,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayer | null> => {
  const players = await db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.source, source),
        eq(PlayersTable.externalId, externalId)
      )
    )
    .limit(1)

  if (players.length === 1) {
    const player = players[0]
    switch (player.kind) {
      case 'player-initialized':
        return player as NodotsPlayerInitialized
      case 'player-seeking-game':
        return player as NodotsPlayerSeekingGame
      case 'player-playing':
        return player as unknown as NodotsPlayerPlaying
      case 'player-incoming':
        return null // not really a player
      default:
      // assert never
      // return null
    }
  }
  return null
}

export const dbGetPlayerBySourceAndExternalIdAndKind = async (
  source: string,
  externalId: string,
  kind: 'player-seeking-game' | 'player-playing',
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayer | null> => {
  const players = await db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.source, source),
        eq(PlayersTable.externalId, externalId),
        eq(PlayersTable.kind, kind)
      )
    )
    .limit(1)

  if (players.length === 1) {
    const player = players[0]
    switch (player.kind) {
      case 'player-initialized':
        return player as NodotsPlayerInitialized
      case 'player-seeking-game':
        return player as NodotsPlayerSeekingGame
      case 'player-playing':
        return player as unknown as NodotsPlayerPlaying
      case 'player-incoming':
        return null // not really a player
      default:
      // assert never
      // return null
    }
  }

  return null
}

// Specialized update
export const dbSetPlayerSeekingGame = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbSetPlayerSeekingGame] id:', id)
  const updatedPlayer = await db
    .update(PlayersTable)
    .set({
      kind: 'player-seeking-game',
    })
    .where(eq(PlayersTable.id, id))
    .returning()

  return updatedPlayer
}

export interface ISetPlayerPlaying {
  id: string
  db: NodePgDatabase<Record<string, never>>
}

export const dbSetPlayerPlaying = async ({ id, db }: ISetPlayerPlaying) => {
  console.log('[dbSetPlayerReady] id:', id)

  return await db
    .update(PlayersTable)
    .set({
      kind: 'player-playing',
    })
    .where(eq(PlayersTable.id, id))
    .returning({ updated: PlayersTable })
}
