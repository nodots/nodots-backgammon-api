import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../../backgammon-types/game'
import {
  dbCreatePlayer,
  dbGetActivePlayerByEmail,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbSetPlayerRolling,
  dbSetPlayerSeekingGame,
  dbSetPlayerReady,
  dbGetPlayerByEmail,
} from './db'
import { PlayerStateError } from './errors'
import {
  NodotsPlayerPlayingReady,
  NodotsPlayerPlayingRolling,
  PlayerKnocking,
} from '../../backgammon-types/player'
import { NodotsPlayersPlaying } from '../../backgammon-types'

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
  color: NodotsColor,
  direction: NodotsMoveDirection,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerReady({ id, color, direction, db })

export const setActivePlayer = async (
  players: NodotsPlayersPlaying,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayersPlaying> =>
  await _setActivePlayer(players, activeColor, db)

// private functions
const _setActivePlayer = async (
  players: NodotsPlayersPlaying,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayersPlaying> => {
  switch (activeColor) {
    case 'black':
      let playersPlaying: NodotsPlayersPlaying
      await db.transaction(async (tx) => {
        playersPlaying.black = (await dbSetPlayerRolling({
          ...players.black,
          db,
        })) as unknown as NodotsPlayerPlayingRolling
        playersPlaying.white = (await dbSetPlayerReady({
          ...players.white,
          db,
        })) as unknown as NodotsPlayerPlayingReady // FIXME
        return playersPlaying
      })
    case 'white':
      await db.transaction(async (tx) => {
        playersPlaying.white = (await dbSetPlayerRolling({
          ...players.white,
          db,
        })) as unknown as NodotsPlayerPlayingRolling
        playersPlaying.black = (await dbSetPlayerReady({
          ...players.black,
          db,
        })) as unknown as NodotsPlayerPlayingReady // FIXME
      })
    default:
      throw PlayerStateError('Invalid active color')
  }
}
