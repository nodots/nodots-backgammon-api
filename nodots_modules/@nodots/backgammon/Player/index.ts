import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../Game'
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

export type NodotsLocale = 'en' | 'es'
export interface NodotsPipCounts {
  black: number
  white: number
}

export interface IPlayerPreferences {
  username?: string
  color?: NodotsColor
  direction?: NodotsMoveDirection
  locale?: NodotsLocale
  automation?: {
    roll: boolean
    move: boolean
  }
}

export type IPlayer = {
  id: string
  email: string
  preferences?: IPlayerPreferences
}

export interface IPlayers {
  black: IPlayer
  white: IPlayer
}

export interface PlayerKnocking extends IPlayer {
  kind: 'player-knocking'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}

// REFACTOR: There is a line somewhere around here where we are
// transitioning from a User to a Player. Backgammon doesn't care
// about users. It cares about players. Move all of the non-player
// stuff to a User module and keep the Player module focused
// on the entities that roll dice, move checkers, etc.
export interface NodotsPlayerInitialized extends IPlayer {
  kind: 'player-initialized'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerSeekingGame extends IPlayer {
  kind: 'player-seeking-game'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerReady extends IPlayer {
  kind: 'player-ready'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerPlayingRolling extends IPlayer {
  kind: 'player-rolling'
  color: NodotsColor
  direction: NodotsMoveDirection
}
export interface NodotsPlayerPlayingMoving extends IPlayer {
  kind: 'player-moving'
  color: NodotsColor
  direction: NodotsMoveDirection
}

export type NodotsPlayerPlaying =
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving

export type NodotsPlayer =
  | NodotsPlayerInitialized
  | NodotsPlayerSeekingGame
  | NodotsPlayerReady
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving
  | NodotsPlayerPlaying

// Combinations of players
// We do not yet know the seeking players color and direction
export interface NodotsPlayersSeekingGame {
  kind: 'players-seeking-game'
  seekers: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame]
}

// Players are both ready to play, with a color and direction
export interface NodotsPlayersReady {
  kind: 'players-ready'
  black: NodotsPlayerReady
  white: NodotsPlayerReady
}

export interface NodotsPlayersBlackRolling {
  kind: 'players-black-rolling'
  black: NodotsPlayerPlayingRolling
  white: NodotsPlayerReady
}

export interface NodotsPlayersBlackMoving {
  kind: 'players-black-moving'
  black: NodotsPlayerPlayingMoving
  white: NodotsPlayerReady
}

export type NodotsPlayersBlackActive =
  | NodotsPlayersBlackRolling
  | NodotsPlayersBlackMoving

export interface NodotsPlayersWhiteRolling {
  kind: 'players-white-rolling'
  black: NodotsPlayerReady
  white: NodotsPlayerPlayingRolling
}

export interface NodotsPlayersWhiteMoving {
  kind: 'players-white-moving'
  black: NodotsPlayerReady
  white: NodotsPlayerPlayingMoving
}

export type NodotsPlayersWhiteActive =
  | NodotsPlayersWhiteRolling
  | NodotsPlayersWhiteMoving

export type NodotsPlayersPlaying =
  | NodotsPlayersBlackActive
  | NodotsPlayersWhiteActive

// export interface NodotsPlayerWinning extends IPlayer {
//   kind: 'player-winning'
// }

// export interface NodotsPlayerResiginging extends IPlayer {
//   kind: 'player-resigning'
// }

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
