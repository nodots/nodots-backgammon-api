import { NodotsColor } from './game'

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6
export type DieOrder = 0 | 1
export type NodotsRoll = [DieValue, DieValue]

export interface NodotsDie {
  color: NodotsColor
  value: DieValue
  order: DieOrder
}

export type NodotsDice = {
  color: NodotsColor
  dice: [NodotsDie, NodotsDie]
}

export interface NodotsDiceInitialized extends NodotsDice {
  kind: 'initialized'
}
export interface NodotsDiceInactive extends NodotsDice {
  kind: 'inactive'
}
export interface NodotsDiceActive extends NodotsDice {
  kind: 'active'
}

export interface NodotsDiceRolled extends NodotsDice {
  kind: 'rolled'
}

export type NodotsDicePlaying =
  | NodotsDiceInactive
  | NodotsDiceRolled
  | NodotsDiceActive

export type NodotsDiceWhiteActive = {
  white: NodotsDiceActive | NodotsDiceRolled
  black: NodotsDiceInactive
}

export type NodotsDiceBlackActive = {
  white: NodotsDiceInactive
  black: NodotsDiceActive | NodotsDiceRolled
}
