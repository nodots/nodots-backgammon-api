import chalk from 'chalk'
import { NodotsColor } from '../..'
export type DieValue = 1 | 2 | 3 | 4 | 5 | 6
export type DieOrder = 0 | 1
export type NodotsRoll = [DieValue, DieValue]

interface NodotsDie {
  color: NodotsColor
  value: DieValue
  order: DieOrder
}

export type NodotsPlayerDice = {
  color: NodotsColor
  dice: [NodotsDie, NodotsDie]
}

export interface NodotsPlayerDiceActive extends NodotsPlayerDice {
  kind: 'active'
  dice: [NodotsDie, NodotsDie]
}

export interface NodotsPlayerDiceInactive extends NodotsPlayerDice {
  kind: 'inactive'
  dice: [NodotsDie, NodotsDie]
}

export type NodotsPlayerDiceState =
  | NodotsPlayerDiceActive
  | NodotsPlayerDiceInactive

export type NodotsPlayersDiceWhite = {
  white: NodotsPlayerDiceActive
  black: NodotsPlayerDiceInactive
}

export type NodotsPlayersDiceBlack = {
  white: NodotsPlayerDiceInactive
  black: NodotsPlayerDiceActive
}

export type NodotsPlayersDiceInactive = {
  white: NodotsPlayerDiceInactive
  black: NodotsPlayerDiceInactive
}

const initializingPlayerDice = (
  color: NodotsColor
): NodotsPlayerDiceInactive => {
  const die1: NodotsDie = {
    color,
    order: 0,
    value: 1,
  }
  const die2: NodotsDie = {
    color,
    order: 1,
    value: 1,
  }
  return {
    kind: 'inactive',
    color,
    dice: [die1, die2],
  }
}

export const initializing = (): NodotsPlayersDiceInactive => {
  return {
    black: initializingPlayerDice('black'),
    white: initializingPlayerDice('white'),
  }
}

export const roll = (): DieValue =>
  (Math.floor(Math.random() * 6) + 1) as DieValue

export const rollDice = (): NodotsRoll => [roll(), roll()]
const isDoubles = (roll: NodotsRoll) => roll[0] === roll[1]

export const rolling = (
  diceState: NodotsPlayerDiceActive
): NodotsPlayerDiceInactive => {
  const roll = rollDice()
  diceState.dice[0].value = roll[0]
  diceState.dice[1].value = roll[1]
  console.log('[Types: Dice] rolling dice:', diceState.dice)
  return {
    ...diceState,
    kind: 'inactive',
    dice: [diceState.dice[0], diceState.dice[1]],
  }
}

export const setPlayersDiceActive = (
  diceState:
    | NodotsPlayersDiceInactive
    | NodotsPlayersDiceBlack
    | NodotsPlayersDiceWhite,
  color: NodotsColor
): NodotsPlayersDiceBlack | NodotsPlayersDiceWhite => {
  console.log('[Types: Dice ] setPlayersDiceActive color:', color)
  console.log(
    chalk.red('[Types: Dice ] setPlayersDiceActive diceState:'),
    diceState
  )
  switch (color) {
    case 'black':
      return {
        white: {
          ...diceState.white,
          kind: 'inactive',
        },
        black: {
          ...diceState.black,
          kind: 'active',
        },
      }
    case 'white':
      return {
        white: {
          ...diceState.white,
          kind: 'active',
        },
        black: {
          ...diceState.black,
          kind: 'inactive',
        },
      }
  }
}
