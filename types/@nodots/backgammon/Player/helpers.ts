import {
  PlayerKnocking,
  PlayerReady,
  INodotsPlayer,
  INodotsPlayers,
  NodotsPlayersPlaying,
  PlayerPlayingWaiting,
  PlayerPlayingRolling,
  PlayerPlayingMoving,
  NodotsPlayersReady,
  PlayerInitialized,
} from '.'
import { randomBoolean } from '..'

import { client } from '../../../../src'
import { NodotsColor, NodotsMoveDirection } from '../Game'

// export const initializePlayers = (
//   player1: PlayerReady | PlayerKnocking,
//   player2: PlayerReady | PlayerKnocking
// ): NodotsPlayersReady => {
//   console.log('[initializePlayers] player1:', player1)
//   console.log('[initializePlayers] player2:', player2)

//   const colors = assignPlayerColors(player1, player2)
//   const directions = assignPlayerDirections(player1, player2)

//   let playerReady1: PlayerReady
//   let playerReady2: PlayerReady

//   playerReady1 =
//     player1.kind === 'player-knocking'
//       ? transmogrifyPlayer(player1, colors[0], directions[0])
//       : {
//           ...player1,
//           kind: 'player-ready',
//           color: colors[0],
//           direction: directions[0],
//         }
//   playerReady2 =
//     player2.kind === 'player-knocking'
//       ? transmogrifyPlayer(player2, colors[1], directions[1])
//       : {
//           ...player2,
//           kind: 'player-ready',
//           color: colors[1],
//           direction: directions[1],
//         }

//   return {
//     kind: 'players-ready',
//     black: playerReady1.color === 'black' ? playerReady1 : playerReady2,
//     white: playerReady1.color === 'white' ? playerReady1 : playerReady2,
//   }
// }

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: INodotsPlayers
): INodotsPlayer => {
  const activePlayer = activeColor === 'black' ? players.black : players.white

  return activePlayer
}

export const getClockwisePlayer = (
  players: NodotsPlayersReady | NodotsPlayersPlaying
) => {
  console.log('[Helpers: Player] getClockwisePlayer players:', players)
  return players.black
  // return players.black.direction === 'clockwise' ? players.black : players.white
}

export const getCounterclockwisePlayer = (
  players: NodotsPlayersReady | NodotsPlayersPlaying
) => {
  console.log('[Helpers: Player] getClockwisePlayer players:', players)
  return players.white
  // return players.black.direction === 'clockwise' ? players.white : players.black}
}

export const getPlayerForMoveDirection = (
  players: NodotsPlayersPlaying,
  direction: NodotsMoveDirection
) =>
  console.log(
    `[Helpers: Player] getPlayerForMoveDirection ${direction} players:`,
    players
  )

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
      return randomBoolean() ? ['black', 'white'] : ['white', 'black']
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
      return randomBoolean() ? ['black', 'white'] : ['white', 'black']
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
      return randomBoolean()
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
      return randomBoolean()
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

// const transmogrifyPlayer = (
//   player: PlayerKnocking,
//   color: NodotsColor,
//   direction: NodotsMoveDirection
// ): PlayerReady => {
//   const playerInitialized: PlayerInitialized = {
//     ...player,
//     kind: 'player-initialized',
//   }
//   return playerReady
// }

// export const transmogrifyPlayers = (
//   players: [PlayerKnocking | PlayerReady, PlayerKnocking | PlayerReady]
// ): NodotsPlayersReady => {
//   const colors = assignPlayerColors(players[0], players[1]) // FIXME: Should send a players tuple
//   const directions = assignPlayerDirections(players[0], players[1]) // FIXME: Should send a players tuple
//   const player1 =
//     players[0].kind === 'player-knocking'
//       ? transmogrifyPlayer(players[0], colors[0], directions[0])
//       : players[0]
//   const player2 =
//     players[1].kind === 'player-knocking'
//       ? transmogrifyPlayer(players[1], colors[1], directions[1])
//       : players[1]

//   return {
//     kind: 'players-ready',
//     black: player1.color === 'black' ? player1 : player2,
//     white: player1.color === 'white' ? player1 : player2,
//   }
// }
