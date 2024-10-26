import { Router } from 'express'
import { AsciiBoard } from '../../nodots_modules/@nodots/backgammon/Board/ascii'

export interface IBoardRouter extends Router {}

export const BoardRouter = (): IBoardRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const board = AsciiBoard
    return res.status(200).send(board)
  })

  return router
}
