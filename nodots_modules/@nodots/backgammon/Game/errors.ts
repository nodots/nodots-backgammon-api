import { NodotsBackgammonError } from '..'

export const GameDbError = (message: string): NodotsBackgammonError => {
  return {
    name: 'GameDbError',
    entity: 'game',
    message,
  }
}
