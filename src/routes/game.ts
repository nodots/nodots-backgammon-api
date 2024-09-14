import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  startGame,
  getGame,
  getGames,
} from '../../nodots_modules/@nodots/backgammon/Game'

export interface IGameRouter extends Router {}

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
    result.length === 1 ? res.status(200).json(result[0]) : res.status(404)
  })

  router.get('/active/:id', async (req, res) => {
    const { id } = req.params
    const result = await getGame(id, db)
    result.length === 1 ? res.status(200).json(result[0]) : res.status(404)
  })

  type StartGamePayload = [string, string]

  router.post('/', async (req, res) => {
    const [player1Id, player2Id] = req.body as StartGamePayload
    if (player1Id === 'fake' || player2Id === 'fake') {
      return {
        error: `Invalid id for player1Id: ${player1Id} or player2Id: ${player2Id}`,
      }
    }

    const game = await startGame(player1Id, player2Id, db)

    res.status(200).json(game)
  })
  return router
}
