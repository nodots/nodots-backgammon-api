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
import { PlayerReady } from './player'
import { NodotsPlayersReady, NodotsPlayersPlaying } from './players'

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

// GameInitializing should never hit the db. Check the db.ts file for the actual db schema
export interface GameInitializing {
  kind: 'game-initializing'
  players: [PlayerReady, PlayerReady]
  board: NodotsBoard
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  cube: NodotsCube
}

export interface GameReady {
  id: string
  kind: 'game-ready'
  players: NodotsPlayersPlaying
  directions: {
    white: NodotsMoveDirection
    black: NodotsMoveDirection
  }
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: NodotsCube
}

export interface GameRollingForStart {
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

export interface GamePlayingRolling {
  id: string
  kind: 'game-playing-rolling'
  players: NodotsPlayersPlaying
  dice: NodotsGameDice
  board: NodotsBoard
  cube: NodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving {
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

export type NodotsGame =
  | GameReady
  | GameRollingForStart
  | GamePlayingRolling
  | GamePlayingMoving

export type NodotsGameActive =
  | GameRollingForStart
  | GamePlayingRolling
  | GamePlayingMoving
