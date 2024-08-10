import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  dbFetchPlayers,
  dbFetchPlayersSeekingGame,
  dbSetPlayerSeekingGame,
} from '../../nodots_modules/@nodots/backgammon/Player/db'
import {
  initialize,
  PlayerKnocking,
} from '../../nodots_modules/@nodots/backgammon/Player'

export interface IPlayerRouter extends Router {}

export const PlayerRouter = (db: NodePgDatabase): IPlayerRouter => {
  const router = Router()

  // Create
  router.post('/', async (req, res) => {
    const incomingPlayer: PlayerKnocking = {
      ...req.body,
      kind: 'player-knocking',
    }
    try {
      const initializedPlayer = await initialize(incomingPlayer, db)
      res.status(200).json(initializedPlayer)
    } catch {
      res.status(500).json({ message: 'Error initializing player' })
    }
  })

  // Read
  router.get('/', async (req, res) => {
    const players = await dbFetchPlayers(db)
    res.status(200).json(players)
  })

  // FIXME id/seeking-game are both strings so this is a hack
  // Specialized read
  router.get('/seeking-game', async (req, res) => {
    const players = await dbFetchPlayersSeekingGame(db)
    res.status(200).json(players)
  })

  // Specialized update
  router.put('/:id/seeking-game', async (req, res) => {
    const id = req.params.id
    const result = await dbSetPlayerSeekingGame(id, db)
    res.status(200).json(result)
  })

  return router
}
