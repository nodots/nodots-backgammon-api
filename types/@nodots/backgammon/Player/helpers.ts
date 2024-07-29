import {
  PlayerKnocking,
  PlayerReady,
  INodotsPlayer,
  INodotsPlayers,
  INodotsPlayersPlaying,
  PlayerPlayingWaiting,
  PlayerPlayingRolling,
  PlayerPlayingMoving,
} from '.'
import { randomBinary } from '..'
import { NodotsColor, NodotsMoveDirection } from '../../..'
import { client } from '../../../../src'

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: INodotsPlayers
): INodotsPlayer => {
  const activePlayer = activeColor === 'black' ? players.black : players.white

  return activePlayer
}

export const getClockwisePlayer = (
  players: INodotsPlayersPlaying
): PlayerPlayingWaiting | PlayerPlayingRolling | PlayerPlayingMoving =>
  players.black.direction === 'clockwise' ? players.black : players.white

export const getCounterclockwisePlayer = (
  players: INodotsPlayersPlaying
): PlayerPlayingWaiting | PlayerPlayingRolling | PlayerPlayingMoving =>
  players.black.direction === 'counterclockwise' ? players.black : players.white

export const getPlayerForMoveDirection = (
  players: INodotsPlayersPlaying,
  direction: NodotsMoveDirection
): PlayerPlayingWaiting | PlayerPlayingRolling | PlayerPlayingMoving =>
  direction === 'clockwise'
    ? getClockwisePlayer(players)
    : getCounterclockwisePlayer(players)

export const findNodotsPlayerFromPlayerKnocking = async (
  player: PlayerKnocking
) => {
  console.log('[findNodotsPlayerFromPlayerKnocking] player:', player)
  const foundPlayers = await client.query(
    `SELECT * FROM players WHERE email = $1`,
    [player.email]
  )
  let foundPlayer: PlayerReady | PlayerKnocking
  if (foundPlayers.rows.length === 1) {
    foundPlayer = foundPlayers.rows[0]
  } else {
    foundPlayer = {
      ...player,
      kind: 'player-knocking',
    }
  }
  return foundPlayer
}

export const assignPlayerColors = (
  player1: PlayerKnocking | PlayerReady,
  player2: PlayerKnocking | PlayerReady
): [NodotsColor, NodotsColor] => {
  if (
    player1.kind === 'player-knocking' &&
    player2.kind === 'player-knocking'
  ) {
    if (
      player1.preferences?.color &&
      player2.preferences?.color &&
      player1.preferences.color !== player2.preferences.color
    ) {
      // easy case--both players have preferences and they are different
      return [player1.preferences.color, player2.preferences.color]
    }
    if (!player1.preferences?.color && !player2.preferences?.color) {
      // neither player has a preference
      return randomBinary() ? ['black', 'white'] : ['white', 'black']
    }
    if (player1.preferences?.color && !player2.preferences?.color) {
      // only player1 has a preference
      const player2Color =
        player1.preferences.color === 'black' ? 'white' : 'black'
      return [player1.preferences.color, player2Color]
    }
    if (!player1.preferences?.color && player2.preferences?.color) {
      // only player2 has a preference
      const player1Color =
        player2.preferences.color === 'black' ? 'white' : 'black'
      return [player1Color, player2.preferences.color]
    }
    if (player1.preferences?.color === player2.preferences?.color) {
      // both players have the same preference
      return randomBinary() ? ['black', 'white'] : ['white', 'black']
    }
    throw Error('assignPlayerColors: unexpected case')
  }
  if (player1.kind === 'player-ready' && player2.kind === 'player-ready') {
    return [player1.color, player2.color]
  }
  throw Error('assignPlayerColors: unexpected case')
}

export const assignPlayerDirections = (
  player1: PlayerKnocking | PlayerReady,
  player2: PlayerKnocking | PlayerReady
): [NodotsMoveDirection, NodotsMoveDirection] => {
  // FIXME: This should be in a switch statement. More FP. Code smell.
  if (
    player1.kind === 'player-knocking' &&
    player2.kind === 'player-knocking'
  ) {
    if (
      player1.preferences?.direction &&
      player2.preferences?.direction &&
      player1.preferences.direction !== player2.preferences.direction
    ) {
      // easy case--both players have preferences and they are different
      return [player1.preferences.direction, player2.preferences.direction]
    }
    if (!player1.preferences?.direction && !player2.preferences?.direction) {
      // neither player has a preference
      return randomBinary()
        ? ['clockwise', 'counterclockwise']
        : ['counterclockwise', 'clockwise']
    }
    if (player1.preferences?.direction && !player2.preferences?.direction) {
      const player2Direction =
        player1.preferences.direction === 'clockwise'
          ? 'counterclockwise'
          : 'clockwise'
      return [player1.preferences.direction, player2Direction]
    }
    if (!player1.preferences?.direction && player2.preferences?.direction) {
      const player1Direction =
        player2.preferences.direction === 'clockwise'
          ? 'counterclockwise'
          : 'clockwise'
      return [player1Direction, player2.preferences.direction]
    }
    if (player1.preferences?.direction === player2.preferences?.direction) {
      // both players have the same preference
      return randomBinary()
        ? ['clockwise', 'counterclockwise']
        : ['counterclockwise', 'clockwise']
    }
    throw Error('assignPlayerDirections: unexpected case')
  }
  if (player1.kind === 'player-ready' && player2.kind === 'player-ready') {
    return [player1.direction, player2.direction]
  }
  throw Error('assignPlayerDirections: unexpected case')
}
