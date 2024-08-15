import {
  DieValue,
  NodotsColor,
  NodotsDiceInitialized,
  NodotsDie,
  NodotsRoll,
} from '../../backgammon-types'

export const roll = (): DieValue =>
  (Math.floor(Math.random() * 6) + 1) as DieValue

export const rollDice = (): NodotsRoll => [roll(), roll()]
export const isDoubles = (roll: NodotsRoll) => roll[0] === roll[1]

export const initializingPlayerDice = (
  color: NodotsColor
): NodotsDiceInitialized => {
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
    kind: 'initialized',
    color,
    dice: [die1, die2],
  }
}
