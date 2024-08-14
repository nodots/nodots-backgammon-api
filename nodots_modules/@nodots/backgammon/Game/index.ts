import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice, setActiveDice } from '../Dice'
import { setActivePlayer, setPlayerReady } from '../Player'
import { NodotsPlayersReady, NodotsPlayerSeekingGame } from '../Player/helpers'
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
import {
  GameInitialized,
  GameInitializing,
  GamePlayingMoving,
  GamePlayingRolling,
  GameRollingForStart,
} from '../../backgammon-types'

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
