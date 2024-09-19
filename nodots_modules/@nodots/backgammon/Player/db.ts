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
import { PlayerReady, PlayerPlaying, Player } from '../../backgammon-types'
import { UpdatedPlayerPreferences } from '.'

export interface ExternalPlayerReference {
  source: string
  externalId: string
}

const playerKinds = ['player-ready', 'player-playing'] as const
export const PlayerTypeEnum = pgEnum('player-kind', playerKinds)

export const PlayersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: PlayerTypeEnum('kind'),
  source: text('source'),
  externalId: text('external_id').unique(),
  email: text('email').unique(),
  preferences: jsonb('preferences'),
  isLoggedIn: boolean('is_logged_in').default(false).notNull(),
  isSeekingGame: boolean('is_seeking_game').default(false).notNull(),
  lastLogIn: timestamp('last_log_in'),
  lastLogOut: timestamp('last_log_out'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
    kind: 'player-ready',
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
      kind: 'player-ready',
      isLoggedIn: true,
      lastLogIn: new Date(),
    })
    .where(eq(PlayersTable.id, id))

export const dbSetPlayerSeekingGame = async (
  id: string,
  seekingGame: boolean,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbSetPlayerSeekingGame] id:', id, 'seekingGame:', seekingGame)
  const result = await db
    .update(PlayersTable)
    .set({
      kind: 'player-ready',
      isSeekingGame: seekingGame,
    })
    .where(eq(PlayersTable.id, id))
    .returning()
  console.log('dbSetPlayerSeekingGame result:', result)
  return result[0] ? result[0] : null
}

export const dbSetPlayerPlaying = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbSetPlayerPlaying] id:', id)
  const result = await db
    .update(PlayersTable)
    .set({
      kind: 'player-playing',
    })
    .where(eq(PlayersTable.id, id))
    .returning()
  console.log('dbSetPlayerPlaying result:', result)
  return result[0] ? result[0] : null
}

export const dbLogoutPlayer = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) =>
  await db
    .update(PlayersTable)
    .set({
      kind: 'player-ready',
      isLoggedIn: false,
      lastLogOut: new Date(),
    })
    .where(eq(PlayersTable.id, id))
    .returning()

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
    .where(eq(PlayersTable.kind, 'player-ready'))

export const dbGetPlayerByExternalSource = async (
  reference: ExternalPlayerReference,
  db: NodePgDatabase<Record<string, never>>
): Promise<Player | null> => {
  const { source, externalId } = reference
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
      case 'player-ready':
        return player as unknown as PlayerReady
      case 'player-playing':
        return player as unknown as PlayerPlaying
      default:
      // assert never
      // return null
    }
  }
  return null
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
