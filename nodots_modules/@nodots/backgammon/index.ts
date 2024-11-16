export type NodotsBackgammonEntity =
  | 'board'
  | 'checker'
  | 'cube'
  | 'player'
  | 'play'
  | 'move'
  | 'game'
  | 'offer'

export interface NodotsBackgammonError extends Error {
  entity: NodotsBackgammonEntity
  message: string
}

export * from './Board'
export * from './Checker'
export * from './Cube'
export * from './Dice'
export * from './Game'
export * from './Player'
