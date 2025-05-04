export type NodotsBackgammonError = {
  name: string
  entity: string
  message: string
}

export const GameStateError = (message: string): NodotsBackgammonError => {
  return {
    name: 'GameStateError',
    entity: 'game',
    message,
  }
}
