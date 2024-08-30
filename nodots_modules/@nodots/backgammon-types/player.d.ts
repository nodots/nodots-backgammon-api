import { NodotsColor, NodotsMoveDirection } from './game'

export type NodotsLocale = 'en' | 'es' | 'fr' | 'ar' | 'tr'
export interface NodotsPipCounts {
  black: number
  white: number
}

export interface IPlayerPreferences {
  username?: string
  givenName?: string
  familyName?: string
  avatar?: string
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
  isLoggedIn: boolean
  preferences?: IPlayerPreferences
}

export interface IPlayers {
  black: IPlayer
  white: IPlayer
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

export interface NodotsPlayerPlaying extends IPlayer {
  kind: 'player-playing'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export type PlayerKind =
  | 'player-knocking'
  | 'player-initialized'
  | 'player-seeking-game'
  | 'player-playing'

export type NodotsPlayer =
  | NodotsPlayerInitialized
  | NodotsPlayerSeekingGame
  | NodotsPlayerPlaying
