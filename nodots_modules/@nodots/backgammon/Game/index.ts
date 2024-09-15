import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice, setActiveDice } from '../Dice'
import { getPlayerById } from '../Player'
import { dbCreateGame, dbGetGame, dbGetAll, dbGetGamesByPlayerId } from './db'
import { GameStateError } from './errors'

import {
  GameInitializing,
  NodotsMoveDirection,
  PlayerReady,
} from '../../backgammon-types'

export type GamePlayerReady = PlayerReady & { direction: NodotsMoveDirection }

// State transitions
export const startGame = async (
  player1Id: string,
  player2Id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const player1 = (await getPlayerById(player1Id, db)) as unknown as PlayerReady // FIXME: This is a hack
  const player2 = (await getPlayerById(player2Id, db)) as unknown as PlayerReady

  const player1Playing: GamePlayerReady = {
    ...player1,
    direction: 'clockwise',
  }

  const player2Playing: GamePlayerReady = {
    ...player2,
    direction: 'counterclockwise',
  }

  if (!player1 || !player2) {
    throw GameStateError('Player not found')
  }

  const board = buildBoard()
  const cube = buildCube()
  const dice = buildDice()

  const gameInitializing: GameInitializing = {
    kind: 'game-initializing',
    players: [player1Playing, player2Playing],
    board,
    cube,
    dice,
  }

  return await dbCreateGame(gameInitializing, db)
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
