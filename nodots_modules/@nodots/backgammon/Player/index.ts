import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  dbCreatePlayer,
  dbGetActivePlayerByEmail,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbSetPlayerSeekingGame,
  dbGetPlayerByEmail,
  dbSetPlayerPlaying,
} from './db'
import { PlayerKnocking } from '../../backgammon-types/player'

export const initializePlayer = async (
  playerKnocking: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => dbCreatePlayer(playerKnocking, db)

export const getAllPlayers = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayers(db)

export const getPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayersSeekingGame(db)

export const getPlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbGetPlayerByEmail(email, db)

export const getActivePlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbGetActivePlayerByEmail(email, db)

export const setPlayerSeekingGame = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerSeekingGame(id, db)

export const setPlayerPlayingReady = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerPlaying({ id, db })
