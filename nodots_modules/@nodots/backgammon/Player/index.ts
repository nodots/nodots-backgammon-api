import { UserInfoResponse as Auth0User } from 'auth0'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  dbGetPlayerById,
  dbGetPlayerByExternalSource,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbUpdatePlayerPreferences,
  dbCreatePlayer,
} from './db'
import {
  NodotsLocale,
  NodotsPlayerInitializing,
  NodotsPlayerPreferences,
} from '../../backgammon-types'

export const getPlayerById = async (playerId: string, db: NodePgDatabase) =>
  await dbGetPlayerById(playerId, db)

export const getAllPlayers = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayers(db)

export const getPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayersSeekingGame(db)

export type UpdatedPlayerPreferences = Partial<NodotsPlayerPreferences>

export const updatePlayerPreferences = async (
  id: string,
  preferences: UpdatedPlayerPreferences,
  db: NodePgDatabase<Record<string, never>>
) => await dbUpdatePlayerPreferences(id, preferences, db)

// export const createPlayerFromAuthOUser = async (
//   user: Auth0User,
//   db: NodePgDatabase<Record<string, never>>
// ) => {
//   const { sub } = user
//   const [source, externalId] = sub.split('|')
//   console.log('[PlayerAPI] createPlayerFromAuthOUser user:', user)
//   try {
//     const playerInitializing: NodotsPlayerInitializing = {
//       source,
//       externalId,
//       kind: 'initializing',
//       preferences: {
//         avatar: user.picture ? user.picture : '',
//         locale: user.locale ? (user.locale as NodotsLocale) : 'en',
//       },
//     }
//     console.log(
//       '[PlayerAPI] createPlayerFromAuthOUser player:',
//       playerInitializing
//     )
//     const result = await dbCreatePlayer(playerInitializing, db)
//     console.log('[PlayerAPI] createPlayerFromAuthOUser result:', result)
//     return result
//   } catch (error) {
//     console.error('Error creating player from Auth0 user:', error)
//     return null
//   }
// }

export const createPlayerFromPlayerInitializing = async (
  playerInitializing: NodotsPlayerInitializing,
  db: NodePgDatabase
) => {
  console.log(
    '[Player API] createPlayerFromAuth0User playerInitializing:',
    playerInitializing
  )
  const result = await dbCreatePlayer(playerInitializing, db)
  return result
}

export const createPlayerFromAuth0User = async (
  user: Auth0User,
  db: NodePgDatabase<Record<string, never>>
) => {
  const { sub } = user
  const [source, externalId] = sub.split('|')
  console.log('[PlayerAPI] createPlayerFromAuth0User user:', user)
  try {
    const playerInitializing: NodotsPlayerInitializing = {
      source,
      externalId,
      kind: 'initializing',
      preferences: {
        avatar: user.picture ? user.picture : '',
        locale: user.locale ? (user.locale as NodotsLocale) : 'en',
      },
    }
    console.log(
      '[PlayerAPI] createPlayerFromAuth0User player:',
      playerInitializing
    )
    const result = await dbCreatePlayer(playerInitializing, db)
    console.log('[PlayerAPI] createPlayerFromAuth0User result:', result)
    return result
  } catch (error) {
    console.error('Error creating player from Auth0 user:', error)
    return null
  }
}
