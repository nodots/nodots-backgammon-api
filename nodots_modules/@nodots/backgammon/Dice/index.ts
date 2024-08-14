/*
Note: Purposefully not doing anything with the database for dice. 
Rolls matter for the model, dice don't except if we want to allow for things 
like players "bringing their own dice" or roll analytics based on randomization 
algorithms?
*/
import { NodotsColor } from '../Game'
import { initializingPlayerDice } from './helpers'
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

export const buildDice = (): {
  black: NodotsDiceInitialized
  white: NodotsDiceInitialized
} => {
  return {
    black: initializingPlayerDice('black'),
    white: initializingPlayerDice('white'),
  }
}

export type NodotsDiceWhiteActive = {
  white: NodotsDiceActive | NodotsDiceRolled
  black: NodotsDiceInactive
}

export type NodotsDiceBlackActive = {
  white: NodotsDiceInactive
  black: NodotsDiceActive | NodotsDiceRolled
}

export const setActiveDice = (
  dice: {
    black: NodotsDiceInitialized | NodotsDiceInactive | NodotsDicePlaying
    white: NodotsDiceInitialized | NodotsDiceInactive | NodotsDicePlaying
  },
  activeColor: NodotsColor
): NodotsDiceWhiteActive | NodotsDiceBlackActive =>
  activeColor === 'black'
    ? {
        black: dice.black as NodotsDiceActive,
        white: dice.white as NodotsDiceInactive,
      }
    : {
        black: dice.black as NodotsDiceInactive,
        white: dice.white as NodotsDiceActive,
      }
