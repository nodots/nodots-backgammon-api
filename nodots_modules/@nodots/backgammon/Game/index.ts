import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice, setActiveDice } from '../Dice'
import {
  setActivePlayer,
  setPlayerPlayingReady,
  getActivePlayerByEmail as _getActivePlayerByEmail,
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
  NodotsPlayerPlayingReady,
  NodotsPlayerSeekingGame,
  NodotsPlayersPlaying,
  NodotsPlayersSeekingGame,
} from '../../backgammon-types'

// State transitions
export const initializeGame = async (
  players: NodotsPlayersSeekingGame,
  db: NodePgDatabase<Record<string, never>>
) => {
  const colors = assignPlayerColors(players)
  const directions = assignPlayerDirections(players)
  // Totally arbitrary
  const blackPlayerSeeking: NodotsPlayerSeekingGame = players.seekers[0]
  const whitePlayerSeeking: NodotsPlayerSeekingGame = players.seekers[1]

  const blackResults = await setPlayerPlayingReady(
    blackPlayerSeeking.id,
    colors[0],
    directions[0],
    db
  )

  const whiteResults = await setPlayerPlayingReady(
    whitePlayerSeeking.id,
    colors[1],
    directions[1],
    db
  )

  const blackReady: NodotsPlayerPlayingReady = {
    id: blackPlayerSeeking.id,
    kind: 'player-playing-ready',
    email: blackPlayerSeeking.email,
    source: blackPlayerSeeking.source,
    externalId: blackPlayerSeeking.externalId,
    color: colors[0],
    direction: directions[0],
  }

  const whiteReady: NodotsPlayerPlayingReady = {
    id: whitePlayerSeeking.id,
    kind: 'player-playing-ready',
    email: whitePlayerSeeking.email,
    source: whitePlayerSeeking.source,
    externalId: whitePlayerSeeking.externalId,
    color: colors[1],
    direction: directions[1],
  }

  const playersPlaying: NodotsPlayersPlaying = {
    kind: 'players-playing',
    white: whiteReady,
    black: blackReady,
  }

  const dice = buildDice()
  const board = buildBoard()
  const cube = buildCube()

  const gameInitializing: GameInitializing = {
    kind: 'game-initializing',
    players: playersPlaying,
    board,
    dice,
    cube,
    id: undefined, // FIXME: This is a hack
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
  const players = setActivePlayer(_game.players, activeColor, db)
  console.log('[players]', players)
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
