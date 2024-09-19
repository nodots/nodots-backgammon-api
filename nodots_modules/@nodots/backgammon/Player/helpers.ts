import { NodotsColor, NodotsMoveDirection } from '../../backgammon-types/game'
import {
  Player,
  PlayerPlaying,
  NodotsPlayersPlaying,
} from '../../backgammon-types'

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: NodotsPlayersPlaying
): Player => (activeColor === 'black' ? players.black : players.white)

export const getClockwisePlayer = (players: NodotsPlayersPlaying) =>
  players.black.direction === 'clockwise' ? players.black : players.white

export const getCounterclockwisePlayer = (players: NodotsPlayersPlaying) =>
  players.black.direction === 'clockwise' ? players.white : players.black

export const getPlayerForMoveDirection = (
  players: NodotsPlayersPlaying,
  direction: NodotsMoveDirection
): PlayerPlaying => getPlayerForMoveDirection(players, direction)
