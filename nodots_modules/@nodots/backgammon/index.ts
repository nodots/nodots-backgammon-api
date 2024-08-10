export { v4 as generateId } from 'uuid'
export const randomBoolean = () => (Math.random() > 0.5 ? true : false)

export { NodotsBoard as INodotsBoard } from './Board'
export { NodotsChecker as INodotsChecker } from './Checker'
export { INodotsCube } from './Cube'
export { INodotsPlayer } from './Player'
export { NodotsMove as INodotsMove } from './Move'
export { INodotsGame } from './Game'

export type NodotsBackgammonEntity =
  | 'board'
  | 'checker'
  | 'cube'
  | 'player'
  | 'play'
  | 'move'
  | 'game'

export interface NodotsBackgammonError extends Error {
  entity: NodotsBackgammonEntity
  message: string
}
