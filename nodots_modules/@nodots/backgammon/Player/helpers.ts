import { NodotsColor, NodotsMoveDirection } from '../../backgammon-types/game'
import {
  IPlayer,
  NodotsPlayerPlaying,
  NodotsPlayerSeekingGame,
  NodotsPlayersPlaying,
  NodotsPlayersSeekingGame,
} from '../../backgammon-types'

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: NodotsPlayersPlaying
): IPlayer => (activeColor === 'black' ? players.black : players.white)

export const getClockwisePlayer = (players: NodotsPlayersPlaying) =>
  players.black.direction === 'clockwise' ? players.black : players.white

export const getCounterclockwisePlayer = (players: NodotsPlayersPlaying) =>
  players.black.direction === 'clockwise' ? players.white : players.black

export const getPlayerForMoveDirection = (
  players: NodotsPlayersPlaying,
  direction: NodotsMoveDirection
): NodotsPlayerPlaying => getPlayerForMoveDirection(players, direction)

export const assignPlayerColors = (
  players: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame]
): [NodotsColor, NodotsColor] => {
  console.log('assignPlayerColors', players)
  return ['black', 'white']
  // const player1 = players.seekers[0]
  // const player2 = players.seekers[1]
  // if (
  //   player1.preferences?.color &&
  //   player2.preferences?.color &&
  //   player1.preferences.color !== player2.preferences.color
  // ) {
  //   // easy case--both players have preferences and they are different
  //   return [player1.preferences.color, player2.preferences.color]
  // }
  // if (!player1.preferences?.color && !player2.preferences?.color) {
  //   // neither player has a preference
  //   return randomBoolean() ? ['black', 'white'] : ['white', 'black']
  // }
  // if (player1.preferences?.color && !player2.preferences?.color) {
  //   // only player1 has a preference
  //   const player2Color =
  //     player1.preferences.color === 'black' ? 'white' : 'black'
  //   return [player1.preferences.color, player2Color]
  // }
  // if (!player1.preferences?.color && player2.preferences?.color) {
  //   // only player2 has a preference
  //   const player1Color =
  //     player2.preferences.color === 'black' ? 'white' : 'black'
  //   return [player1Color, player2.preferences.color]
  // }
  // if (player1.preferences?.color === player2.preferences?.color) {
  //   // both players have the same preference
  //   return randomBoolean() ? ['black', 'white'] : ['white', 'black']
  // }
  // throw Error('assignPlayerColors: unexpected case')
}

export const assignPlayerDirections = (
  players: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame]
): [NodotsMoveDirection, NodotsMoveDirection] => {
  return ['clockwise', 'counterclockwise']
  // const player1 = players.seekers[0]
  // const player2 = players.seekers[1]
  // if (
  //   player1.preferences?.direction &&
  //   player2.preferences?.direction &&
  //   player1.preferences.direction !== player2.preferences.direction
  // ) {
  //   // easy case--both players have preferences and they are different
  //   return [player1.preferences.direction, player2.preferences.direction]
  // }
  // if (!player1.preferences?.direction && !player2.preferences?.direction) {
  //   // neither player has a preference
  //   return randomBoolean()
  //     ? ['clockwise', 'counterclockwise']
  //     : ['counterclockwise', 'clockwise']
  // }
  // if (player1.preferences?.direction && !player2.preferences?.direction) {
  //   const player2Direction =
  //     player1.preferences.direction === 'clockwise'
  //       ? 'counterclockwise'
  //       : 'clockwise'
  //   return [player1.preferences.direction, player2Direction]
  // }
  // if (!player1.preferences?.direction && player2.preferences?.direction) {
  //   const player1Direction =
  //     player2.preferences.direction === 'clockwise'
  //       ? 'counterclockwise'
  //       : 'clockwise'
  //   return [player1Direction, player2.preferences.direction]
  // }
  // if (player1.preferences?.direction === player2.preferences?.direction) {
  //   // both players have the same preference
  //   return randomBoolean()
  //     ? ['clockwise', 'counterclockwise']
  //     : ['counterclockwise', 'clockwise']
  // }
  // throw Error('assignPlayerDirections: unexpected case')
}
