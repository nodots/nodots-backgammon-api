import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice, setActiveDice } from '../Dice'
import {
  getActivePlayerByEmail as _getActivePlayerByEmail,
  getPlayerById,
} from '../Player'
import {
  dbCreateGame,
  dbGetGame,
  dbGetAll,
  dbGetGamesByPlayerId,
  dbGetInitializedGameById,
  dbSetGameRolling,
} from './db'
import { assignPlayerColors, assignPlayerDirections } from '../Player/helpers'
import { GameStateError } from './errors'
import { randomBoolean } from '..'
import {
  GameInitialized,
  GameInitializing,
  NodotsPlayers,
  NodotsPlayersPlaying,
  PlayerPlaying,
  PlayerSeekingGame,
} from '../../backgammon-types'

// State transitions
export const startGame = async (
  player1Id: string,
  player2Id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const player1 = await getPlayerById(player1Id, db)
  const player2 = await getPlayerById(player2Id, db)

  if (!player1 || !player2) {
    throw GameStateError('Player not found')
  }

  console.log('[@nodots/Game] startGame player1:', player1)
  console.log('[@nodots/Game] startGame player2:', player2)

  const players = [player1, player2] as NodotsPlayers

  const colors = assignPlayerColors(players)
  console.log('[@nodots/Game] startGame colors:', colors)

  const directions = assignPlayerDirections(players)
  console.log('[@nodots/Game] startGame directions:', directions)
  // // Totally arbitrary
  const blackPlayerSeeking = players[0] as PlayerSeekingGame
  const whitePlayerSeeking = players[1] as PlayerSeekingGame
  const blackPlaying: PlayerPlaying = {
    ...blackPlayerSeeking,
    kind: 'player-playing',
    color: colors[0],
    direction: directions[0],
  }
  const whitePlaying: PlayerPlaying = {
    ...whitePlayerSeeking,
    kind: 'player-playing',
    color: colors[1],
    direction: directions[1],
  }
  const playersPlaying: NodotsPlayersPlaying = {
    kind: 'players-playing',
    black: blackPlaying,
    white: whitePlaying,
  }
  console.log('[@nodots/Game] startGame playersPlaying:', playersPlaying)
  const dice = buildDice()
  const board = buildBoard()
  const cube = buildCube()
  const gameInitializing: GameInitializing = {
    kind: 'game-initializing',
    players: [blackPlaying, whitePlaying],
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
  const game = await getInitializedGameById(gameId, db)
  if (!game) {
    throw GameStateError('Game not found')
  }
  const _game = game as unknown as GameInitialized
  const activeColor = randomBoolean() ? 'black' : 'white'
  const gameRolling = await dbSetGameRolling(_game, activeColor, db)
  console.log('rollForStart game', gameRolling)
}

// Getters
export const getGames = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbGetAll(db)

export const getGame = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbGetGame(gameId, db)

export const getGamesByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log('getGamesByPlayerId', playerId)
  return await dbGetGamesByPlayerId(playerId, db)
}

export const getActivePlayerByEmail = async (
  email: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  return await _getActivePlayerByEmail(email, db)
}

export const getInitializedGameById = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const initializedGame = await dbGetInitializedGameById(gameId, db)
  console.log('getInitializedGameById', initializedGame)
  return initializedGame
}
