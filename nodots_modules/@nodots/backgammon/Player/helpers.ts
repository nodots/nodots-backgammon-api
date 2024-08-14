import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { dbFetchPlayerByEmail } from './db'
import { NodotsColor, NodotsMoveDirection } from '../../backgammon-types/game'

export const getActivePlayer = (
  activeColor: NodotsColor,
  players: NodotsPlayersPlaying
): IPlayer => (activeColor === 'black' ? players.black : players.white)

export const getClockwisePlayer = (
  players: NodotsPlayersReady | NodotsPlayersPlaying
) => (players.black.direction === 'clockwise' ? players.black : players.white)

export const getCounterclockwisePlayer = (
  players: NodotsPlayersReady | NodotsPlayersPlaying
) => (players.black.direction === 'clockwise' ? players.white : players.black)

export const getPlayerForMoveDirection = (
  players: NodotsPlayersPlaying,
  direction: NodotsMoveDirection
): NodotsPlayerPlaying => getPlayerForMoveDirection(players, direction)

export const fetchPlayerByEmail = async (
  player: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => await dbFetchPlayerByEmail(player.email, db)

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
export type NodotsLocale = 'en' | 'es'
export interface NodotsPipCounts {
  black: number
  white: number
}

export interface IPlayerPreferences {
  username?: string
  color?: NodotsColor
  direction?: NodotsMoveDirection
  locale?: NodotsLocale
  automation?: {
    roll: boolean
    move: boolean
  }
}

export type IPlayer = {
  id: string
  email: string
  preferences?: IPlayerPreferences
}

export interface IPlayers {
  black: IPlayer
  white: IPlayer
}

export interface PlayerKnocking extends IPlayer {
  kind: 'player-knocking'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}
// REFACTOR: There is a line somewhere around here where we are
// transitioning from a User to a Player. Backgammon doesn't care
// about users. It cares about players. Move all of the non-player
// stuff to a User module and keep the Player module focused
// on the entities that roll dice, move checkers, etc.

export interface NodotsPlayerInitialized extends IPlayer {
  kind: 'player-initialized'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerSeekingGame extends IPlayer {
  kind: 'player-seeking-game'
  source: string
  externalId: string
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerReady extends IPlayer {
  kind: 'player-ready'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: IPlayerPreferences
}

export interface NodotsPlayerPlayingRolling extends IPlayer {
  kind: 'player-rolling'
  color: NodotsColor
  direction: NodotsMoveDirection
}
export interface NodotsPlayerPlayingMoving extends IPlayer {
  kind: 'player-moving'
  color: NodotsColor
  direction: NodotsMoveDirection
}

export type NodotsPlayerPlaying =
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving

export type NodotsPlayer =
  | NodotsPlayerInitialized
  | NodotsPlayerSeekingGame
  | NodotsPlayerReady
  | NodotsPlayerPlayingRolling
  | NodotsPlayerPlayingMoving
  | NodotsPlayerPlaying
// Combinations of players
// We do not yet know the seeking players color and direction

export interface NodotsPlayersSeekingGame {
  kind: 'players-seeking-game'
  seekers: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame]
}
// Players are both ready to play, with a color and direction

export interface NodotsPlayersReady {
  kind: 'players-ready'
  black: NodotsPlayerReady
  white: NodotsPlayerReady
}

export interface NodotsPlayersBlackRolling {
  kind: 'players-black-rolling'
  black: NodotsPlayerPlayingRolling
  white: NodotsPlayerReady
}

export interface NodotsPlayersBlackMoving {
  kind: 'players-black-moving'
  black: NodotsPlayerPlayingMoving
  white: NodotsPlayerReady
}

export type NodotsPlayersBlackActive =
  | NodotsPlayersBlackRolling
  | NodotsPlayersBlackMoving

export interface NodotsPlayersWhiteRolling {
  kind: 'players-white-rolling'
  black: NodotsPlayerReady
  white: NodotsPlayerPlayingRolling
}

export interface NodotsPlayersWhiteMoving {
  kind: 'players-white-moving'
  black: NodotsPlayerReady
  white: NodotsPlayerPlayingMoving
}

export type NodotsPlayersWhiteActive =
  | NodotsPlayersWhiteRolling
  | NodotsPlayersWhiteMoving

export type NodotsPlayersPlaying =
  | NodotsPlayersBlackActive
  | NodotsPlayersWhiteActive
