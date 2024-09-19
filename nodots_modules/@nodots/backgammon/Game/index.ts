import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice, setActiveDice } from '../Dice'
import { getPlayerById } from '../Player'
import { dbCreateGame, dbGetGame, dbGetAll, dbGetGamesByPlayerId } from './db'
import { GameStateError } from './errors'

import {
  NodotsGameInitializing,
  NodotsPlayerReady,
} from '../../backgammon-types'

// State transitions
export const startGame = async (
  player1Id: string,
  player2Id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const player1 = (await getPlayerById(player1Id, db)) as NodotsPlayerReady
  const player2 = (await getPlayerById(player2Id, db)) as NodotsPlayerReady

  const clockwisePlayer: NodotsPlayerReady = {
    ...player1,
    direction: 'clockwise',
  }

  const counterclockwisePlayer: NodotsPlayerReady = {
    ...player2,
    direction: 'counterclockwise',
  }

  if (!player1 || !player2) {
    throw GameStateError('Player not found')
  }

  const board = buildBoard()
  const cube = buildCube()
  const dice = buildDice()

  const gameInitializing: NodotsGameInitializing = {
    kind: 'initializing',
    players: {
      black:
        clockwisePlayer.color === 'black'
          ? clockwisePlayer
          : counterclockwisePlayer,
      white:
        clockwisePlayer.color === 'white'
          ? clockwisePlayer
          : counterclockwisePlayer,
    },
    board,
    dice,
    cube,
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
