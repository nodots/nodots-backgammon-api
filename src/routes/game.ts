import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import { initialized } from '../../types/@nodots/backgammon/Game'

export interface IGameRouter extends Router {}

export const GameRouter = (db: NodePgDatabase): IGameRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Games list' })
  })

  router.post('/', async (req, res) => {
    const { players } = req.body.players
    try {
      const initializedGame = await initialized(players, db)
      res.status(200).json(initializedGame)
    } catch {
      res.status(500).json({ message: 'Error initializing player' })
    }
  })

  // router.post('/', async (req, res) => {
  //   res.status(200).json({ request: req.body })
  //   // Logic for starting a game goes here

  //   // const players = initializePlayers(player1, player2)
  //   // const dice = buildDice()
  //   // const board = buildBoard(players)
  //   // const cube = buildCube()

  //   // const game: GameInitialized = {
  //   //   kind: 'game-initialized',
  //   //   dice,
  //   //   board,
  //   //   cube,
  //   //   players,
  //   // }

  //   res.status(200).json({ message: 'Game started!' })
  // })

  return router
}
