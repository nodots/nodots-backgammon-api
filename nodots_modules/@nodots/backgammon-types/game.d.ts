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
import { NodotsPlayerReady } from './player'
import { NodotsPlayersPlaying } from './players'

export type NodotsColor = 'black' | 'white'
export type NodotsMoveDirection = 'clockwise' | 'counterclockwise'

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

// GameInitializing should never hit the db. Check the db.ts file for the actual db schema
type _Game = {
  kind: 'initializing' | 'ready' | 'rolling-for-start' | 'rolling' | 'moving'
  players: NodotsPlayersPlaying
}

export interface NodotsGameInitializing {
  kind: 'initializing'
  players: [NodotsPlayerReady, NodotsPlayerReady]
  board: NodotsBoard
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  cube: NodotsCube
}

export interface NodotsGameReady {
  id: string
  kind: 'ready'
  NodotsGameInitializing: NodotsPlayersPlaying
  directions: {
    white: NodotsMoveDirection
    black: NodotsMoveDirection
  }
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: NodotsGameReady
}

export interface NodotsGameRollingForStart {
  id: string
  kind: 'rolling-for-start'
  players: NodotsPlayersPlaying
  dice: {
    white: NodotsDice
    black: NodotsDice
  }
  board: NodotsBoard
  cube: NodotsGameReady
}

export interface NodotsGamePlayingRolling {
  id: string
  NodotsGameRollingForStart: 'rolling'
  players: NodotsPlayersPlaying
  dice: NodotsGameDice
  board: NodotsBoard
  cube: NodotsGameReady
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface NodotsGamePlayingMoving {
  id: string
  kind: 'moving'
  players: NodotsPlayersPlaying
  dice: NodotsGameDice
  board: NodotsBoard
  cube: NodotsGameReady
  activeColor: NodotsColor
  activeRoll: NodotsRoll
  activePlay?: NodotsPlay
}

export type NodotsGame =
  | NodotsGameReady
  | NodotsGameRollingForStart
  | NodotsGamePlayingRolling
  | NodotsGamePlayingMoving

export type NodotsGameActive =
  | NodotsGameRollingForStart
  | NodotsGamePlayingRolling
  | NodotsGamePlayingMoving
