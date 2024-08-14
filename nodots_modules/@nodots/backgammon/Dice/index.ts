/*
Note: Purposefully not doing anything with the database for dice. 
Rolls matter for the model, dice don't except if we want to allow for things 
like players "bringing their own dice" or roll analytics based on randomization 
algorithms?
*/
import { NodotsColor } from '../../backgammon-types'
import { initializingPlayerDice } from './helpers'
import {
  NodotsDiceInitialized,
  NodotsDiceActive,
  NodotsDiceInactive,
  NodotsDicePlaying,
  NodotsDiceBlackActive,
  NodotsDiceWhiteActive,
} from '../../backgammon-types/dice'

export const buildDice = (): {
  black: NodotsDiceInitialized
  white: NodotsDiceInitialized
} => {
  return {
    black: initializingPlayerDice('black'),
    white: initializingPlayerDice('white'),
  }
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
