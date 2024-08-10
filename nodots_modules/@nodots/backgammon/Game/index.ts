import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { randomBoolean } from '..'
import { buildBoard, NodotsBoard } from '../Board'
import { NodotsChecker } from '../Checker'
import { buildCube, INodotsCube } from '../Cube'
import {
  NodotsPlayersDiceBlack,
  NodotsPlayersDiceInactive,
  NodotsPlayersDiceWhite,
  NodotsRoll,
  setPlayersDiceActive,
  buildDice,
} from '../Dice'
import { NodotsPlay } from '../Play'
import {
  NodotsPlayers,
  NodotsPlayersReady,
  NodotsPlayersSeekingGame,
  PlayerSeekingGame,
  PlayerWinning,
  setPlayerReady,
} from '../Player'
import { dbCreateGame, getAll } from './db'
import { assignPlayerColors, assignPlayerDirections } from '../Player/helpers'

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

export interface INodotsGame {
  players: NodotsPlayers
}

export interface GameInitializing extends INodotsGame {
  kind: 'game-initializing'
  players: NodotsPlayersReady
}

export interface GameInitialized extends INodotsGame {
  kind: 'game-initialized'
  players: NodotsPlayersReady
  dice: NodotsPlayersDiceInactive
  board: NodotsBoard
  cube: INodotsCube
}

export interface GameRollingForStart extends INodotsGame {
  kind: 'game-rolling-for-start'
  players: NodotsPlayersReady
  dice: NodotsPlayersDiceInactive
  board: NodotsBoard
  cube: INodotsCube
}

export interface GamePlayingRolling extends INodotsGame {
  kind: 'game-playing-rolling'
  players: NodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: NodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving extends INodotsGame {
  kind: 'game-playing-moving'
  players: NodotsPlayers
  dice: NodotsPlayersDiceWhite | NodotsPlayersDiceBlack
  board: NodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GameCompleted extends INodotsGame {
  kind: 'game-completed'
  activeColor: NodotsColor
  board: NodotsBoard
  cube: INodotsCube
  roll: NodotsRoll
  players: NodotsPlayers
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
  players: [PlayerSeekingGame, PlayerSeekingGame],
  db: NodePgDatabase<Record<string, never>>
) => {
  const colors = assignPlayerColors(players)
  const directions = assignPlayerDirections(players)
  console.log('[initializeGame] players:', players)

  const blackReady = await setPlayerReady(
    players[0].id,
    colors[0],
    directions[0],
    db
  )

  const whiteReady = await setPlayerReady(
    players[1].id,
    colors[1],
    directions[1],
    db
  )
  const playersReady: NodotsPlayersReady = {
    kind: 'players-ready',
    black: {
      ...players[0],
      ...blackReady,
      kind: 'player-ready',
      color: colors[1], // FIXME. Should be coming from blackReady
      direction: directions[1], // FIXME. Should be coming from blackReady
    },

    white: {
      ...players[1],
      ...whiteReady,
      kind: 'player-ready',
      color: colors[1], // FIXME. Should be coming from whiteReady
      direction: directions[1], // FIXME. Should be coming from whiteReady
    },
  }

  const dice = buildDice()
  const board = buildBoard()
  const cube = buildCube()

  const gameInitialized: GameInitialized = {
    kind: 'game-initialized',
    players: playersReady,
    board,
    dice,
    cube,
  }

  return await dbCreateGame(gameInitialized, db)
}

export const listGames = async (db: NodePgDatabase<Record<string, never>>) =>
  await getAll(db)

export const getGame = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const games = await getAll(db)
  return games.find((game) => game.id === id)
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
