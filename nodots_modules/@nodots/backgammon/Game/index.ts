import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildBoard } from '../Board'
import { buildCube } from '../Cube'
import { buildDice } from '../Dice'
import { getPlayerById } from '../Player'
import {
  dbCreateGame,
  dbGetGame,
  dbGetAll,
  dbGetActiveGameByPlayerId,
} from './db'
import { GameStateError } from './errors'

import {
  NodotsColor,
  NodotsGameInitialized,
  NodotsMoveDirection,
  NodotsPlayerReady,
} from '../../backgammon-types'
import { dbSetPlayerPlaying } from '../Player/db'

// State transitions
export const startGame = async (
  player1Id: string,
  player2Id: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  if (player1Id === player2Id) return console.error('player1Id === player2Id')
  const player1 = (await getPlayerById(player1Id, db)) as NodotsPlayerReady
  const player2 = (await getPlayerById(player2Id, db)) as NodotsPlayerReady

  if (!player1 || !player2) {
    throw GameStateError('Player not found')
  }

  const board = buildBoard()
  const cube = buildCube()
  const dice = buildDice()
  const players = {
    black: {
      player: player1,
      attributes: {
        color: 'black' as NodotsColor,
        direction: 'clockwise' as NodotsMoveDirection,
        pipCount: 167,
      },
    },
    white: {
      player: player2,
      attributes: {
        color: 'white' as NodotsColor,
        direction: 'counterclockwise' as NodotsMoveDirection,
        pipCount: 167,
      },
    },
  }

  const gameInitialized: NodotsGameInitialized = {
    kind: 'initialized',
    players,
    board,
    cube,
    dice,
  }

  const player1Playing = await dbSetPlayerPlaying(player1Id, db)
  const playerPlaying2 = await dbSetPlayerPlaying(player2Id, db)
  return await dbCreateGame(gameInitialized, db)
}

// Getters
export const getGames = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbGetAll(db)

export const getGame = async (
  gameId: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbGetGame(gameId, db)

export const getActiveGameByPlayerId = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  console.log(
    '[Backgammon Game API] getActiveGameByPlayerId playerId:',
    playerId
  )
  return await dbGetActiveGameByPlayerId(playerId, db)
}
