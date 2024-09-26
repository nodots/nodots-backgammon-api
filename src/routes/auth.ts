import { Router } from 'express'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export interface IAuthRouter extends Router {}

export const AuthRouter = (db: NodePgDatabase): IAuthRouter => {
  const router = Router()

  router.get('/', (req, res) => {
    res.send('Welcome to the Nodots Backgammon Auth API!')
  })

  return router
}
