import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  initializeGame,
  getGame,
  getGames,
  rollForStart,
  // rollForStart,
} from '../../nodots_modules/@nodots/backgammon/Game'
import { NodotsPlayerSeekingGame } from '../../nodots_modules/@nodots/backgammon/Player'

export interface IGameRouter extends Router {}

export const GameRouter = (db: NodePgDatabase): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const games = await getGames(db)
    res.status(200).json(games)
  })

  router.get('/:id', async (req, res) => {
    const { id } = req.params
    const game = await getGame(id, db)
    res.status(200).json(game)
  })

  router.post('/', async (req, res) => {
    const players: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame] = req.body
    const game = await initializeGame(players, db)
    res.status(200).json(game)
  })

  router.post('/:id/roll-for-start', async (req, res) => {
    const { id } = req.params
    const game = await rollForStart(id, db)
    res.status(200).json({ kind: 'game-rolling-for-start', id })
  })

  return router
}
