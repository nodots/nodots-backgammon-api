import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  dbGetPlayerById,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbUpdatePlayerPreferences,
  dbCreatePlayer,
} from './db'
import {
  NodotsPlayerInitializing,
  NodotsPlayerPreferences,
} from '../../backgammon-types'

export const getPlayerById = async (playerId: string, db: NodePgDatabase) =>
  await dbGetPlayerById(playerId, db)

export const getPlayers = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbGetPlayers(db)

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
    '[Player API] createPlayerFromPlayerInitializing playerInitializing:',
    playerInitializing
  )
  const result = await dbCreatePlayer(playerInitializing, db)
  console.log('[Player API] createPlayerFromPlayerInitializing result:', result)
  return result
}
