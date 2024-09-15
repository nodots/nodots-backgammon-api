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

/* Minimum player information -- this could come from a variety of sources, hence "I" for interface. */
export type IPlayer = {
  email: string
  isLoggedIn: boolean
  preferences?: IPlayerPreferences
}

// PlayerInitializing should never hit the db. Check the db.ts file for the actual db schema
export interface PlayerInitializing extends IPlayer {
  kind: 'player-initializing'
}

export interface PlayerReady extends IPlayer {
  id: string
  kind: 'player-ready'
  source: string
  isSeekingGame: boolean
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export interface PlayerPlaying extends IPlayer {
  id: string
  kind: 'player-playing'
  activity: PlayerActivity
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export type PlayerKind =
  | 'player-initializing'
  | 'player-ready'
  | 'player-playing'

export type PlayerActivity = 'rolling' | 'moving' | 'waiting' | undefined

export type NodotsPlayer = PlayerReady | PlayerPlaying
