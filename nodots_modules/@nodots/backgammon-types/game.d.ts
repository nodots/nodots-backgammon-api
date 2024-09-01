import { NodotsBoard } from './board'
import { NodotsChecker } from './checker'
import { NodotsCube } from './cube'
import {
  NodotsRoll,
  NodotsGameDice,
  NodotsDiceInitialized,
  NodotsDice,
} from './dice'
import { NodotsPlay } from './play'
import { NodotsPlayersPlaying } from './players'

export const CHECKERS_PER_PLAYER = 15
export type PointPosition =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24

export type PlayerCheckers = [
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker,
  NodotsChecker
]

export type CheckercontainerPosition = PointPosition | 'bar' | 'off'
export type OriginPosition = PointPosition | 'bar'
export type DestinationPosition = PointPosition | 'off'
export type NodotsColor = 'black' | 'white'
export type NodotsMoveDirection = 'clockwise' | 'counterclockwise'

export interface NodotsGame {
  id: string | undefined
}

export interface GameInitializing extends NodotsGame {
  kind: 'game-initializing'
  players: NodotsPlayersPlaying
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: NodotsCube
}

export interface GameInitialized extends NodotsGame {
  id: string
  kind: 'game-initialized'
  players: NodotsPlayersPlaying
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: NodotsCube
}

export interface GameRollingForStart extends NodotsGame {
  id: string
  kind: 'game-rolling-for-start'
  players: NodotsPlayersPlaying
  dice: {
    white: NodotsDice
    black: NodotsDice
  }
  board: NodotsBoard
  cube: NodotsCube
}

export interface GamePlayingRolling extends NodotsGame {
  id: string
  kind: 'game-playing-rolling'
  players: NodotsPlayersPlaying
  dice: NodotsGameDice
  board: NodotsBoard
  cube: NodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving extends NodotsGame {
  id: string
  kind: 'game-playing-moving'
  players: NodotsPlayersPlaying
  dice: NodotsGameDice
  board: NodotsBoard
  cube: NodotsCube
  activeColor: NodotsColor
  activeRoll: NodotsRoll
  activePlay?: NodotsPlay
}

// export interface GameCompleted extends INodotsGame {
//   kind: 'game-completed'
//   activeColor: NodotsColor
//   board: NodotsBoard
//   cube: NodotsCube
//   roll: NodotsRoll
//   players:
//   winner: PlayerWinning
// }

export type NodotsGameState =
  | GameInitializing
  | GameInitialized
  | GameRollingForStart
  | GamePlayingRolling
  | GamePlayingMoving

export type NodotsGameStateInitializing = GameInitializing
export type NodotsGameStateActive =
  | GameInitialized
  | GameRollingForStart
  | GamePlayingRolling
  | GamePlayingMoving
