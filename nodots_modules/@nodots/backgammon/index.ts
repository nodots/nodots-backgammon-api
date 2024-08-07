export { v4 as generateId } from 'uuid'
export const randomBoolean = () => (Math.random() > 0.5 ? true : false)

export { INodotsBoard } from './Board'
export { INodotsChecker } from './Checker'
export { INodotsCube } from './Cube'
export { INodotsPlayer } from './Player'
export { INodotsMove } from './Move'
export { INodotsGame } from './Game'

export type NodotsBackgammonEntity =
  | 'board'
  | 'checker'
  | 'cube'
  | 'player'
  | 'move'
  | 'game'

export interface NodotsBackgammonError extends Error {
  entity: NodotsBackgammonEntity
  message: string
}
