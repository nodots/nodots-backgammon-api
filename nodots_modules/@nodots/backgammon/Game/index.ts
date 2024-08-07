import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { randomBoolean } from '..'
import { INodotsBoard } from '../Board'
import { INodotsChecker } from '../Checker'
import { INodotsCube } from '../Cube'
import {
  NodotsPlayersDiceBlack,
  NodotsPlayersDiceInactive,
  NodotsPlayersDiceWhite,
  NodotsRoll,
  setPlayersDiceActive,
} from '../Dice'
import { NodotsPlay } from '../Play'
import {
  INodotsPlayers,
  NodotsPlayersReady,
  NodotsPlayersSeekingGame,
  PlayerWinning,
} from '../Player'
import { create, getAll } from './db'

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

export interface INodotsGame {
  players: INodotsPlayers
}

export interface GameInitializing extends INodotsGame {
  kind: 'game-initializing'
  players: NodotsPlayersReady
}

export interface GameInitialized extends INodotsGame {
  kind: 'game-initialized'
  players: NodotsPlayersReady
  dice: NodotsPlayersDiceInactive
  board: INodotsBoard
  cube: INodotsCube
}

export interface GameRollingForStart extends INodotsGame {
  kind: 'game-rolling-for-start'
  players: NodotsPlayersReady
  dice: NodotsPlayersDiceInactive
  board: INodotsBoard
  cube: INodotsCube
}

export interface GamePlayingRolling extends INodotsGame {
  kind: 'game-playing-rolling'
  players: INodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: INodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving extends INodotsGame {
  kind: 'game-playing-moving'
  players: INodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: INodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GameCompleted extends INodotsGame {
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
  | GamePlayingRolling
  | GamePlayingMoving
  | GameCompleted

export const initializeGame = async (
  players: NodotsPlayersReady | NodotsPlayersSeekingGame,
  db: NodePgDatabase<Record<string, never>>
) => {
  switch (players.kind) {
    case 'players-ready':
      return await create(players, db)
    case 'players-seeking-game':
      const playersReady = setPlayersReady(players)
      return await create(playersReady, db)
  }
}

export const listGames = async (db: NodePgDatabase<Record<string, never>>) => {
  return await getAll(db)
}

export const rollForStart = (
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
