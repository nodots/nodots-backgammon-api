import { NodotsLocale } from '../../src/i18n'
import { NodotsColor, NodotsMoveDirection } from './game'

/**
 * These are types because they are idiosyncratic to this way of
 * tracking move direction and representation of that direction.
 * They are explicitly NOT exported from the player module.
 */
type _Player = {
  kind: NodotsPlayerKind
  id?: string
  email?: string
  isSeekingGame?: boolean
  isLoggedIn?: boolean
  source?: string
  externalId?: string
  preferences?: NodotsPlayerPreferences
}
export type NodotsPlayerKind = 'initializing' | 'ready' | 'playing'

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
  email: string
  source: string
  externalId: string
  isLoggedIn: false
  preferences: NodotsPlayerPreferences
}

export interface NodotsPlayerReady extends _Player {
  id: string
  kind: 'ready'
  source: string
  externalId: string
  email: string
  isSeekingGame: boolean
  isLoggedIn: true
}

export interface NodotsPlayerPlaying extends _Player {
  id: string
  kind: 'playing'
  source: string
  externalId: string
  email: string
  isSeekingGame: boolean
  isLoggedIn: true
}

export type NodotsPlayer =
  | NodotsPlayerInitializing
  | NodotsPlayerReady
  | NodotsPlayerPlaying
