import { NodotsColor, NodotsMoveDirection } from './game'

export type NodotsLocale = 'en' | 'es' | 'fr' | 'ar' | 'tr'
export interface NodotsPipCounts {
  black: number
  white: number
}

export interface PlayerPreferences {
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

export type Player = {
  kind: 'player-ready' | 'player-playing' | 'player-initializing'
  id?: string
  email?: string
  activity?: PlayerActivity
  source?: string
  isSeekingGame?: boolean
  isLoggedIn?: boolean
  externalId?: string
  color?: NodotsColor
  direction?: NodotsMoveDirection
  preferences?: PlayerPreferences
}

export interface PlayerInitializing extends Player {
  kind: 'player-initializing'
}

export interface PlayerReady extends Player {
  id: string
  kind: 'player-ready'
  source: string
  isSeekingGame: boolean
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: PlayerPreferences
}

export interface PlayerPlaying extends Player {
  id: string
  kind: 'player-playing'
  activity: PlayerActivity
  source: string
  isSeekingGame: false
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: PlayerPreferences
}

export type PlayerKind =
  | 'player-initializing'
  | 'player-ready'
  | 'player-playing'

export type PlayerActivity = 'rolling' | 'moving' | 'waiting' | undefined

export type PlayerActive = PlayerReady | PlayerPlaying
