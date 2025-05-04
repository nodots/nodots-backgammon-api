import { Router } from 'express'
import { Game } from '../../nodots_modules/@nodots/nodots-backgammon-core/src'
import { BackgammonPlayers } from '../../nodots_modules/@nodots/nodots-backgammon-core/src/types'
// import { Game } from '../../nodots_modules/@nodots/nodots-backgammon-core/src'

export interface IGameRouter extends Router {}

export const GameRouter = (): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    return { message: 'Welcome to the Nodots Backgammon Game API!' }
  })

  router.post('/game', async (req, res) => {
    const players: BackgammonPlayers = req.body.players
    return { message: 'Welcome to the Nodots Backgammon Game API!', players }
  })

  return router
}
