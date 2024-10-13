import { and, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { UpdatedPlayerPreferences } from '.'
import {
  NodotsPlayer,
  NodotsPlayerInitializing,
  NodotsPlayerReady,
} from '../../backgammon-types'

export interface ExternalPlayerReference {
  source: string
  externalId: string
}

// FIXME: We should be able to define this via the backgammon-types module
const playerKinds = ['ready', 'playing'] as const
export const PlayerTypeEnum = pgEnum('player-kind', playerKinds)

export const PlayersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: PlayerTypeEnum('kind').notNull(),
  source: text('source'),
  externalId: text('external_id').unique(),
  email: text('email').unique().notNull(),
  isLoggedIn: boolean('is_logged_in').default(false).notNull(),
  isSeekingGame: boolean('is_seeking_game').default(false).notNull(),
  lastLogIn: timestamp('last_log_in'),
  lastLogOut: timestamp('last_log_out'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dbCreatePlayer = async (
  playerInititalizing: NodotsPlayerInitializing,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayerReady> => {
  const player: typeof PlayersTable.$inferInsert = {
    ...playerInititalizing,
    kind: 'ready',
  }
  console.log('[dbCreatePlayer] player:', player)
  const result = (await db
    .insert(PlayersTable)
    .values(player)
    .returning()) as unknown as NodotsPlayerReady
  console.log('[dbCreatePlayer] result:', result)
  return result
}

export const dbLoginPlayer = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbLoginPlayer] id:', id)
  const result = await db
    .update(PlayersTable)
    .set({
      kind: 'ready',
      isLoggedIn: true,
      lastLogIn: new Date(),
    })
    .where(eq(PlayersTable.id, id))
    .returning()
  return result.length === 1 ? result[0] : null
}

export const dbSetPlayerSeekingGame = async (
  id: string,
  seekingGame: boolean,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('[dbSetPlayerSeekingGame] id:', id, 'seekingGame:', seekingGame)
  const result = await db
    .update(PlayersTable)
    .set({
      kind: 'ready',
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
      kind: 'playing',
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
      kind: 'ready',
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

export const dbGetPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => await db.select().from(PlayersTable).where(eq(PlayersTable.kind, 'ready'))

export const dbGetPlayerByExternalSource = async (
  reference: ExternalPlayerReference,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayer | null> => {
  const { source, externalId } = reference
  const result = (await db
    .select()
    .from(PlayersTable)
    .where(
      and(
        eq(PlayersTable.source, source),
        eq(PlayersTable.externalId, externalId)
      )
    )
    .limit(1)) as NodotsPlayer[]

  return result.length === 1 ? result[0] : null
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
