import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard, NodotsBoard } from '../Board'
import { NodotsChecker } from '../Checker'
import { buildCube, INodotsCube } from '../Cube'
import {
  NodotsDiceInitialized,
  NodotsDiceBlackActive,
  NodotsDiceWhiteActive,
  buildDice,
  setActiveDice,
} from '../Dice'
import { NodotsPlay } from '../Play'
import {
  NodotsPlayersReady,
  NodotsPlayerSeekingGame,
  setActivePlayer,
  setPlayerReady,
  NodotsPlayersPlaying,
} from '../Player'
import {
  dbCreateGame,
  dbGetGame,
  dbGetAll,
  dbGetGameByIdAndKind,
  dbSetGameRolling,
} from './db'
import { assignPlayerColors, assignPlayerDirections } from '../Player/helpers'
import { GameNotFoundError, GameStateError } from './errors'
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
  id: string | undefined
}

export interface GameInitializing extends INodotsGame {
  kind: 'game-initializing'
  players: NodotsPlayersReady
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: INodotsCube
}

export interface GameInitialized extends INodotsGame {
  id: string
  kind: 'game-initialized'
  players: NodotsPlayersReady
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: INodotsCube
}

export interface GameRollingForStart extends INodotsGame {
  id: string
  kind: 'game-rolling-for-start'
  players: NodotsPlayersReady
  dice: {
    white: NodotsDiceInitialized
    black: NodotsDiceInitialized
  }
  board: NodotsBoard
  cube: INodotsCube
}

export interface GamePlayingRolling extends INodotsGame {
  id: string
  kind: 'game-playing-rolling'
  players: NodotsPlayersPlaying
  dice: NodotsDiceWhiteActive | NodotsDiceBlackActive
  board: NodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

export interface GamePlayingMoving extends INodotsGame {
  id: string
  kind: 'game-playing-moving'
  players: NodotsPlayersPlaying
  dice: NodotsDiceWhiteActive | NodotsDiceBlackActive
  board: NodotsBoard
  cube: INodotsCube
  activeColor: NodotsColor
  activePlay?: NodotsPlay
}

// export interface GameCompleted extends INodotsGame {
//   kind: 'game-completed'
//   activeColor: NodotsColor
//   board: NodotsBoard
//   cube: INodotsCube
//   roll: NodotsRoll
//   players: NodotsPlayers
//   winner: PlayerWinning
// }

export type NodotsGameState =
  | GameInitializing
  | GameInitialized
  | GameRollingForStart
  | GamePlayingRolling
  | GamePlayingMoving

// State transitions
export const initializeGame = async (
  players: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame],
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

  const gameInitializing: GameInitializing = {
    id: undefined,
    kind: 'game-initializing',
    players: playersReady,
    board,
    dice,
    cube,
  }

  return await dbCreateGame(gameInitializing, db)
}

export const rollForStart = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const getGameResult = await getGameByIdAndKind(gameId, 'game-initialized', db)
  switch (getGameResult?.kind) {
    case 'game-initialized':
      const gameInitialized = getGameResult as GameInitialized // FIXME. Code smell
      const { players, dice } = gameInitialized
      const activeColor = randomBoolean() ? 'black' : 'white'
      const updatedPlayers = await setActivePlayer(players, activeColor, db)
      const updatedDice = await setActiveDice(dice, activeColor)

      const gamePlayingRolling: GamePlayingRolling = {
        ...gameInitialized,
        kind: 'game-playing-rolling',
        activeColor,
        players: updatedPlayers,
        dice: updatedDice,
      }
      return await dbSetGameRolling(gamePlayingRolling, db)
    default:
      throw GameNotFoundError(`Game not found: ${gameId}`)
  }
}

// Getters
export const getGames = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbGetAll(db)

export const getGame = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbGetGame(gameId, db)

// Private methods. Helpers?
const getGameByIdAndKind = async (
  gameId: string,
  kind:
    | 'game-initializing'
    | 'game-initialized'
    | 'game-rolling-for-start'
    | 'game-playing-rolling'
    | 'game-playing-moving'
    | 'game-completed',
  db: NodePgDatabase<Record<string, never>>
) => {
  try {
    const result = await dbGetGameByIdAndKind(gameId, kind, db)
    const untypedGame = result[0] // FIXME. Code smell
    switch (untypedGame.kind) {
      case 'game-initializing':
        const gameInitializing = untypedGame as unknown as GameInitializing // FIXME. Code smell
        return {
          ...gameInitializing,
          kind: 'game-initializing',
        }
      case 'game-initialized':
        const gameInitialized = untypedGame as unknown as GameInitialized // FIXME. Code smell
        return {
          ...gameInitialized,
          kind: 'game-initialized',
        }
      case 'game-rolling-for-start':
        const gameRollingForStart =
          untypedGame as unknown as GameRollingForStart // FIXME. Code smell
        return {
          ...gameRollingForStart,
          kind: 'game-rolling-for-start',
        }
      case 'game-playing-rolling':
        const gamePlayingRolling = untypedGame as unknown as GamePlayingRolling // FIXME. Code smell
        return {
          ...gamePlayingRolling,
          kind: 'game-playing-rolling',
        }
      case 'game-playing-moving':
        const gamePlayingMoving = untypedGame as unknown as GamePlayingMoving // FIXME. Code smell
        return {
          ...gamePlayingMoving,
          kind: 'game-playing-moving',
        }
      // case 'game-completed':
      //   const gameCompleted = untypedGame as unknown as GameCompleted // FIXME. Code smell
      //   return {
      //     ...gameCompleted,
      //     kind: 'game-completed',
      //   }

      default:
        throw GameStateError(`Invalid game state: ${untypedGame.kind}`)
    }
  } catch (error) {
    throw GameNotFoundError(`Game not found: ${gameId}`)
  }
}
