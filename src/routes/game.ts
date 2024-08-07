import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import { initializeGame } from '../../nodots_modules/@nodots/backgammon/Game'
import {
  NodotsPlayersReady,
  NodotsPlayersSeekingGame,
} from '../../nodots_modules/@nodots/backgammon/Player'
export interface IGameRouter extends Router {}

export const GameRouter = (db: NodePgDatabase): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Games list' })
  })

  router.post('/', async (req, res) => {
    const players = req.body.players as
      | NodotsPlayersSeekingGame
      | NodotsPlayersReady
    try {
      const initializedGame = await initializeGame(gamePlayers, db)
      res.status(200).json(initializedGame)
    } catch {
      res.status(500).json({
        message: '[Routers: Game] Error initializing game. Players:',
        players,
      })
    }
  })

  return router
}
