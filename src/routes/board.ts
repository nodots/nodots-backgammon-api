import { Router } from 'express'
import { BackgammonBoard } from 'nodots-backgammon-core'

export interface IBoardRouter extends Router {}

export const BoardRouter = (): IBoardRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const board = BackgammonBoard.getAsciiBoard(BackgammonBoard.initialize())
    return res.status(200).send(board)
  })

  return router
}
