import { NodotsBoard } from './board'
import { NodotsChecker } from './checker'
import { NodotsCube } from './cube'
import { NodotsRoll, NodotsDice } from './dice'
import { NodotsPlay } from './play'
import { NodotsPlayerPlaying, NodotsPlayerReady } from './player'
import { NodotsPlayersPlaying, NodotsPlayersReady } from './players'

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

export interface NodotsGamePlayer {
  playerId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  pipCount: number
}

export type NodotsGamePlayers = [NodotsGamePlayer, NodotsGamePlayer]

// GameInitializing should never hit the db. Check the db.ts file for the actual db schema
type _Game = {
  kind: 'initializing' | 'ready' | 'rolling-for-start' | 'rolling' | 'moving'
  players: NodotsPlayersPlaying
}

export interface NodotsGameInitializing {
  kind: 'initializing'
  players: NodotsGamePlayers
}

export interface NodotsGameInitialized {
  kind: 'initialized'
  players: NodotsGamePlayers
  board: NodotsBoard
  dice: NodotsDice
  cube: NodotsCube
}

export interface NodotsGameReady {
  id: string
  kind: 'ready'
  players: NodotsGamePlayers
  board: NodotsBoard
  dice: NodotsDice
  cube: NodotsCube
}

export interface NodotsGameRollingForStart {
  id: string
  kind: 'rolling-for-start'
  players: NodotsGamePlayers
  board: NodotsBoard
  dice: NodotsDice
  cube: NodotsCube
}

export interface NodotsGameRolling {
  id: string
  kind: 'rolling'
  players: NodotsGamePlayers
  dice: NodotsDice
  board: NodotsBoard
  cube: NodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface NodotsGameMoving {
  id: string
  kind: 'moving'
  players: NodotsGamePlayers
  dice: NodotsDice
  board: NodotsBoard
  cube: NodotsCube
  activeColor: NodotsColor
  activeRoll: NodotsRoll
  activePlay?: NodotsPlay
}

export type NodotsGame =
  | NodotsGameReady
  | NodotsGameRollingForStart
  | NodotsGameRolling
  | NodotsGameMoving

export type NodotsGameActive =
  | NodotsGameRollingForStart
  | NodotsGameRolling
  | NodotsGameMoving
