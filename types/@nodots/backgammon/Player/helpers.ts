import { NodotsColor, NodotsMoveDirection } from '../../Types'
import {
  INodotsPlayer,
  INodotsPlayers,
  NodotsPlayer,
  NodotsPlayers,
} from './Types'

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: INodotsPlayers
): INodotsPlayer => {
  const activePlayer = activeColor === 'black' ? players.black : players.white

  return activePlayer
}

export const getClockwisePlayer = (players: NodotsPlayers): NodotsPlayer =>
  players.black.direction === 'clockwise' ? players.black : players.white

export const getCounterclockwisePlayer = (
  players: NodotsPlayers
): NodotsPlayer =>
  players.black.direction === 'counterclockwise' ? players.black : players.white

export const getPlayerForMoveDirection = (
  players: NodotsPlayers,
  direction: NodotsMoveDirection
): NodotsPlayer =>
  direction === 'clockwise'
    ? getClockwisePlayer(players)
    : getCounterclockwisePlayer(players)
