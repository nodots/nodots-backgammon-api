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

export interface NodotsPlayerPlayingReady extends IPlayer {
  kind: 'player-playing-ready'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerPlayingRolling extends IPlayer {
  kind: 'player-playing-rolling'
  color: NodotsColor
  direction: NodotsMoveDirection
}
export interface NodotsPlayerPlayingMoving extends IPlayer {
  kind: 'player-playing-moving'
  color: NodotsColor
  direction: NodotsMoveDirection
}

export type PlayerKind =
  | 'player-knocking'
  | 'player-initialized'
  | 'player-seeking-game'
  | 'player-playing-ready'
  | 'player-playing-rolling'
  | 'player-playing-moving'

export type NodotsPlayerPlaying =
  | NodotsPlayerPlayingReady
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving

export type NodotsPlayer =
  | NodotsPlayerInitialized
  | NodotsPlayerSeekingGame
  | NodotsPlayerPlayingReady
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving
