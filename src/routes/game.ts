import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  startGame,
  getGame,
  getGames,
  getActiveGameByPlayerId,
} from '../../nodots_modules/@nodots/backgammon/Game'
import { isValidUuid } from '../../nodots_modules/@nodots/backgammon-types/utils'

export interface IGameRouter extends Router {}
export type StartGamePayload = [string, string]

export const GameRouter = (db: NodePgDatabase): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const games = await getGames(db)
    res.status(200).json(games)
  })

  router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log('[GameRouter] get id:', id)

    const result = await getGame(id, db)
    result ? res.status(200).json(result[0]) : res.status(404)
  })

  router.get('/active/:id', async (req, res) => {
    const { id } = req.params
    const result = await getGame(id, db)
    result ? res.status(200).json(result) : res.status(404)
  })

  router.get('/player/:id', async (req, res) => {
    const { id } = req.params
    // console.log('*(*(**[Game Router] getActiveGameByPlayerId id:', id)
    const game = await getActiveGameByPlayerId(id, db)
    // console.log('[Game Router] getActiveGameByPlayerId game:', game)
    res.status(200).json(game)
  })

  router.post('/', async (req, res) => {
    const [player1Id, player2Id] = req.body as StartGamePayload
    if (
      !isValidUuid(player1Id) ||
      !isValidUuid(player2Id) ||
      player1Id === player2Id
    ) {
      return {
        error: `Invalid id for player1Id: ${player1Id} or player2Id: ${player2Id}`,
      }
    }

    const game = await startGame(player1Id, player2Id, db)

    res.status(200).json(game)
  })
  return router
}
