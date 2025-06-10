import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import { getGame, getGames, saveGame, updateGame } from '../db/Games'

export interface IGamesRouter extends Router {}

export const GamesRouter = (db: NodePgDatabase): IGamesRouter => {
  const router = Router()
  router.post('/', async (req, res) => {
    try {
      await saveGame(req.body, db)
      res.status(201).send()
    } catch (error) {
      res.status(500).json({ error: 'Failed to create game' })
    }
  })

  router.get('/', async (_req, res) => {
    try {
      const games = await getGames(db)
      res.json(games)
    } catch (error) {
      res.status(500).json({ error: 'Failed to get games' })
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const game = await getGame(db, req.params.id)
      if (!game) {
        res.status(404).json({ error: 'Game not found' })
        return
      }
      res.json(game)
    } catch (error) {
      res.status(500).json({ error: 'Failed to get game' })
    }
  })

  router.put('/:id', async (req, res) => {
    try {
      await updateGame(db, req.body)
      res.status(200).send()
    } catch (error) {
      res.status(500).json({ error: 'Failed to update game' })
    }
  })

  return router
}
