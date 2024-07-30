import { NodotsBackgammonError } from '..'

export const PlayerDbError = (message: string): NodotsBackgammonError => {
  return {
    name: 'PlayerDbError',
    entity: 'player',
    message,
  }
}
