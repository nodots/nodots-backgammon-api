import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  getGame,
  initializeGame,
  listGames,
} from '../../nodots_modules/@nodots/backgammon/Game'
import { PlayerSeekingGame } from '../../nodots_modules/@nodots/backgammon/Player'

export interface IGameRouter extends Router {}

export const GameRouter = (db: NodePgDatabase): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const games = await listGames(db)
    res.status(200).json(games)
  })

  router.get('/:id', async (req, res) => {
    const { id } = req.params
    const game = await getGame(id, db)
    res.status(200).json(game)
  })

  router.post('/', async (req, res) => {
    const players: [PlayerSeekingGame, PlayerSeekingGame] = req.body
    const initializedGame = await initializeGame(players, db)
    res.status(200).json({ message: 'Game initialized', initializedGame })
  })

  return router
}
