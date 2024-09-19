import { NodotsLocale } from '.'
import { NodotsColor, NodotsMoveDirection } from './game'

/**
 * These are types because they are idiosyncratic to this way of
 * tracking move direction and representation of that direction.
 * They are explicitly NOT exported from the player module.
 */
type _Player = {
  kind: 'initializing' | 'ready' | 'playing'
  id?: string
  email?: string
  isSeekingGame?: boolean
  isLoggedIn?: boolean
  source?: string
  externalId?: string
  color?: NodotsColor
  direction?: NodotsMoveDirection
  preferences?: NodotsPlayerPreferences
  activity?: NodotsPlayerActivity
}
export type NodotsPlayerKind = 'initializing' | 'ready' | 'playing'
type NodotsPlayerActivity = 'rolling' | 'moving' | 'waiting' | undefined
type _PipCounts = {
  black: number
  white: number
}

export interface NodotsPlayerPreferences {
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

export interface NodotsPlayerInitializing extends _Player {
  kind: 'initializing'
}

export interface NodotsPlayerActive extends _Player {
  id: string
  kind: 'ready' | 'playing'
  email: string
  isSeekingGame: boolean
  isLoggedIn: true
  source: string
  externalId: string
}

export interface NodotsPlayerReady extends NodotsPlayerActive {
  kind: 'ready'
}

export interface NodotsPlayerPlaying extends NodotsPlayerActive {
  kind: 'playing'
  isSeekingGame: false
  activity: NodotsPlayerActivity // REVISIT this once we have a game going
  // Do we still need these directly attached to player? Not the player object in the game?
  // FIXME. This is almost certainly wrong.
  color: NodotsColor
  direction: NodotsMoveDirection
}
