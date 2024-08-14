import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../../backgammon-types/game'
import {
  dbCreatePlayer,
  dbFetchPlayers,
  dbFetchPlayersSeekingGame,
  dbSetPlayerReady,
  dbSetPlayerRolling,
  dbSetPlayerSeekingGame,
  dbSetPlayerWaiting,
} from './db'
import { PlayerStateError } from './errors'
import {
  NodotsPlayerPlayingRolling,
  NodotsPlayerReady,
  NodotsPlayersPlaying,
  NodotsPlayersReady,
  PlayerKnocking,
} from '../../backgammon-types/player'

export const initializePlayer = async (
  playerKnocking: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => dbCreatePlayer(playerKnocking, db)

export const fetchAllPlayers = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbFetchPlayers(db)

export const fetchPlayersSeekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => await dbFetchPlayersSeekingGame(db)

export const setPlayerSeekingGame = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerSeekingGame(id, db)

export const setPlayerReady = async (
  id: string,
  color: NodotsColor,
  direction: NodotsMoveDirection,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerReady({ id, color, direction, db })

export const setActivePlayer = async (
  players: NodotsPlayersReady | NodotsPlayersPlaying,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayersPlaying> =>
  await _setActivePlayer(players, activeColor, db)

// private functions
const _setActivePlayer = async (
  players: NodotsPlayersReady | NodotsPlayersPlaying,
  activeColor: NodotsColor,
  db: NodePgDatabase<Record<string, never>>
): Promise<NodotsPlayersPlaying> => {
  switch (activeColor) {
    case 'black':
      let playersPlaying: NodotsPlayersPlaying
      await db.transaction(async (tx) => {
        playersPlaying.black = (await dbSetPlayerRolling({
          id: players.black.id,
          db,
        })) as unknown as NodotsPlayerPlayingRolling
        playersPlaying.white = (await dbSetPlayerWaiting({
          id: players.white.id,
          db,
        })) as unknown as NodotsPlayerReady // FIXME
        return playersPlaying
      })
    case 'white':
      await db.transaction(async (tx) => {
        playersPlaying.white = (await dbSetPlayerRolling({
          id: players.white.id,
          db,
        })) as unknown as NodotsPlayerPlayingRolling
        playersPlaying.black = (await dbSetPlayerWaiting({
          id: players.black.id,
          db,
        })) as unknown as NodotsPlayerReady // FIXME
      })
    default:
      throw PlayerStateError('Invalid active color')
  }
}
