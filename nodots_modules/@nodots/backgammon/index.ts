export { v4 as generateId } from 'uuid'
export const randomBoolean = () => (Math.random() > 0.5 ? true : false)

export { NodotsMove } from '../backgammon-types/move'
export { NodotsGame } from '../backgammon-types/game'

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
