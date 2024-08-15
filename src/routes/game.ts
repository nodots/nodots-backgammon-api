import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  initializeGame,
  getGame,
  getGames,
  rollForStart,
  getActivePlayerByEmail,
  // rollForStart,
} from '../../nodots_modules/@nodots/backgammon/Game'
import {
  NodotsPlayerPlaying,
  NodotsPlayersSeekingGame,
} from '../../nodots_modules/@nodots/backgammon-types'

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
    const players: NodotsPlayersSeekingGame = req.body
    const game = await initializeGame(players, db)
    res.status(200).json(game)
  })

  router.post('/:id/roll-for-start', async (req, res) => {
    const { id } = req.params
    console.log('roll-for-start id:', id)
    const game = await rollForStart(id, db)
    console.log('roll-for-start game:', game)
    res.status(200).json({ game })
  })

  router.get(`/player/:email`, async (req, res) => {
    const { email } = req.params
    const player = await getActivePlayerByEmail(email, db)

    res.status(200).json(player)
  })

  return router
}
