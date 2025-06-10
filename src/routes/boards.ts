import { Router } from 'express'
import { Board } from '@nodots-llc/backgammon-core'

export interface IBoardsRouter extends Router {}

export const BoardsRouter = (): IBoardsRouter => {
  const router = Router()
  const { generateRandomBoard, getAsciiBoard } = Board

  router.get('/', async (req, res) => {
    const board = getAsciiBoard(generateRandomBoard())
    return res.status(200).send(board)
  })

  return router
}
