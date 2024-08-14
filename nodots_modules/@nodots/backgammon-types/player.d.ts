import { NodotsColor, NodotsMoveDirection } from './game'

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

export type NodotsPlayers =
  | NodotsPlayersSeekingGame
  | NodotsPlayersReady
  | NodotsPlayersPlaying

// export interface NodotsPlayerWinning extends IPlayer {
//   kind: 'player-winning'
// }

// export interface NodotsPlayerResiginging extends IPlayer {
//   kind: 'player-resigning'
// }
