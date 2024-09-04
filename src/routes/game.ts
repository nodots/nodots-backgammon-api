import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  startGame,
  getGame,
  getGames,
  rollForStart,
  getActivePlayerByEmail,
  // rollForStart,
} from '../../nodots_modules/@nodots/backgammon/Game'
import {
  GameInitialized,
  PlayerPlaying,
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
    console.log('[GameRouter] get id:', id)
    res.status(200).json({ id })

    // const result = await getGame(id, db)
    // result.length === 1 ? res.status(200).json(result[0]) : res.status(404)
  })

  router.get('/active/:id', async (req, res) => {
    const { id } = req.params
    const result = await getGame(id, db)
    result.length === 1 ? res.status(200).json(result[0]) : res.status(404)
  })

  interface IStartGamePayload {
    player1Id: string
    player2Id: string
  }

  router.post('/', async (req, res) => {
    const { player1Id, player2Id } = req.body as IStartGamePayload
    if (player1Id === 'fake' || player2Id === 'fake') {
      return {
        error: `Invalid id for player1Id: ${player1Id} or player2Id: ${player2Id}`,
      }
    }

    const game = await startGame(player1Id, player2Id, db)

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
