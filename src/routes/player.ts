import { PgUUID } from 'drizzle-orm/pg-core'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  initialized,
  list,
  PlayerKnocking,
} from '../../nodots_modules/@nodots/backgammon/Player'
import {
  getSeekingGame,
  setSeekingGame,
} from '../../nodots_modules/@nodots/backgammon/Player/db'

export interface IPlayerRouter extends Router {}

export const PlayerRouter = (db: NodePgDatabase): IPlayerRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const players = await list(db)
    res.status(200).json(players)
  })

  router.post('/', async (req, res) => {
    const incomingPlayer: PlayerKnocking = {
      ...req.body,
      kind: 'player-knocking',
    }
    try {
      const initializedPlayer = await initialized(incomingPlayer, db)
      res.status(200).json(initializedPlayer)
    } catch {
      res.status(500).json({ message: 'Error initializing player' })
    }
  })

  router.get('/seeking-game', async (req, res) => {
    const players = await getSeekingGame(db)
    res.status(200).json(players)
  })

  // route to set player seeking game
  router.put('/:id/seeking-game', async (req, res) => {
    const uuid = req.params.id as unknown as PgUUID<any> // FIXME
    const result = await setSeekingGame(uuid, db)
    res.status(200).json(result)
  })

  return router
}
