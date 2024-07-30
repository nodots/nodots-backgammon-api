import chalk from 'chalk'
import { INodotsBoard, buildBoard } from '../Board'
import { INodotsCube, buildCube } from '../Cube'
import { INodotsChecker } from '../Checker'
import { NodotsPlay } from '../Play'
import {
  buildDice,
  NodotsPlayersDiceBlack,
  NodotsPlayersDiceInactive,
  NodotsPlayersDiceWhite,
  NodotsRoll,
  setPlayersDiceActive,
} from '../Dice'
import {
  INodotsPlayers,
  NodotsPlayersReady,
  PlayerKnocking,
  PlayerReady,
  PlayerWinning,
} from '../Player'
import { transmogrifyPlayers } from '../Player/helpers'
import { randomBoolean } from '..'

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
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker,
  INodotsChecker
]

export type CheckercontainerPosition = PointPosition | 'bar' | 'off'
export type OriginPosition = PointPosition | 'bar'
export type DestinationPosition = PointPosition | 'off'
export type NodotsColor = 'black' | 'white'
export type NodotsMoveDirection = 'clockwise' | 'counterclockwise'

export interface GameInitializing {
  kind: 'game-initializing'
}

export interface GameInitialized {
  kind: 'game-initialized'
  dice: NodotsPlayersDiceInactive
  players: NodotsPlayersReady
  board: INodotsBoard
  cube: INodotsCube
}

export interface GameRollingForStart {
  kind: 'game-rolling-for-start'
  players: NodotsPlayersReady
  dice: NodotsPlayersDiceInactive
  board: INodotsBoard
  cube: INodotsCube
}

export interface GamePlayingRolling {
  kind: 'game-playing-rolling'
  players: INodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: INodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving {
  kind: 'game-playing-moving'
  players: INodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: INodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GameCompleted {
  kind: 'game-completed'
  activeColor: NodotsColor
  board: INodotsBoard
  cube: INodotsCube
  roll: NodotsRoll
  players: INodotsPlayers
  winner: PlayerWinning
}

export type NodotsGameState =
  | GameInitializing
  | GameInitialized
  | GameRollingForStart
  | GamePlayingMoving
  | GamePlayingRolling
  | GameCompleted

export const initializing = (
  externalPlayers: [PlayerKnocking | PlayerReady, PlayerKnocking | PlayerReady]
): GameInitialized => {
  console.log(chalk.green('5. [Types: Game]'), externalPlayers)

  const players = transmogrifyPlayers(externalPlayers)
  const board = buildBoard(players)
  const dice = buildDice()
  const cube = buildCube()

  return {
    kind: 'game-initialized',
    dice,
    players,
    board,
    cube,
  }
}

export const rollingForStart = (
  gameState: GameInitialized,
  players: NodotsPlayersReady
): GamePlayingRolling => {
  const activeColor = randomBoolean() ? 'black' : 'white'
  const dice = setPlayersDiceActive(gameState.dice, activeColor)
  return {
    ...gameState,
    kind: 'game-playing-rolling',
    activeColor,
    players,
    dice,
  }
}
