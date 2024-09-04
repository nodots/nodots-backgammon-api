import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserInfoResponse as Auth0User } from 'auth0'
import { boolean } from 'drizzle-orm/pg-core'
import { eq, and } from 'drizzle-orm'
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import {
  PlayerSeekingGame,
  NodotsPlayer,
  PlayerInitialized,
  PlayerPlaying,
} from '../../backgammon-types'
import { UpdatedPlayerPreferences } from '.'

const playerKinds = [
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
  isLoggedIn: boolean('is_logged_in').default(false).notNull(),
  lastLogIn: timestamp('last_log_in'),
  lastLogOut: timestamp('last_log_out'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Create
export const dbCreatePlayerFromAuth0User = async (
  user: Auth0User,
  isLoggedIn: boolean,
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
    isLoggedIn: isLoggedIn,
    lastLogIn: isLoggedIn ? new Date() : null,
    preferences: {
      username: user.preferred_username
        ? user.preferred_username
        : user.nickname,
      address: user.address,
      avatar: user.picture,
      locale: user.locale ? user.locale : 'en',
    },
  }
  const result = await db.insert(PlayersTable).values(player).returning()
  return result[0] ? result[0] : null
}

export const dbLoginPlayer = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .update(PlayersTable)
    .set({
      isLoggedIn: true,
      lastLogIn: new Date(),
    })
    .where(eq(PlayersTable.id, id))

export const dbLogoutPlayer = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .update(PlayersTable)
    .set({
      isLoggedIn: false,
      lastLogOut: new Date(),
    })
    .where(eq(PlayersTable.id, id))
    .returning()

// Read
export const dbGetPlayers = async (db: NodePgDatabase<Record<string, never>>) =>
  await db.select().from(PlayersTable)

export const dbGetPlayerById = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const result = await db
    .select()
    .from(PlayersTable)
    .where(and(eq(PlayersTable.id, id)))
    .limit(1)
  return result?.length === 1 ? result[0] : null
}

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
        return player as PlayerInitialized
      case 'player-seeking-game':
        return player as PlayerSeekingGame
      case 'player-playing':
        return player as unknown as PlayerPlaying
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
        return player as PlayerInitialized
      case 'player-seeking-game':
        return player as PlayerSeekingGame
      case 'player-playing':
        return player as unknown as PlayerPlaying
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
  kind: 'player-initialized' | 'player-seeking-game',
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbSetPlayerSeekingGame] id:', id)
  console.log('[dbSetPlayerSeekingGame] kind:', kind)
  const updatedPlayer = await db
    .update(PlayersTable)
    .set({
      kind,
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

export const dbUpdatePlayerPreferences = async (
  id: string,
  preferences: UpdatedPlayerPreferences,
  db: NodePgDatabase<Record<string, never>>
) => {
  return await db
    .update(PlayersTable)
    .set({
      preferences,
    })
    .where(eq(PlayersTable.id, id))
    .returning()
}
