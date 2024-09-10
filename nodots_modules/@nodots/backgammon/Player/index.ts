import { UserInfoResponse as Auth0User } from 'auth0'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  dbCreatePlayerFromAuth0User,
  dbGetPlayerById,
  dbGetPlayerByExternalSource,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbUpdatePlayerPreferences,
} from './db'

import { IPlayerPreferences } from '../../backgammon-types/player'

export const getPlayerById = async (playerId: string, db: NodePgDatabase) =>
  await dbGetPlayerById(playerId, db)

export const getAllPlayers = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayers(db)

export const getPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayersSeekingGame(db)

export type UpdatedPlayerPreferences = Partial<IPlayerPreferences>

export const updatePlayerPreferences = async (
  id: string,
  preferences: UpdatedPlayerPreferences,
  db: NodePgDatabase<Record<string, never>>
) => await dbUpdatePlayerPreferences(id, preferences, db)

export const createPlayerFromAuthOUser = async (
  user: Auth0User,
  isLoggedIn: boolean,
  db: NodePgDatabase<Record<string, never>>
) => {
  const { sub } = user
  const [source, externalId] = sub.split('|')
  try {
    let player = await dbGetPlayerByExternalSource({ source, externalId }, db)
    return player
      ? player
      : await dbCreatePlayerFromAuth0User(user, isLoggedIn, db)
  } catch (error) {
    console.error('Error creating player from Auth0 user:', error)
    return null
  }
}
