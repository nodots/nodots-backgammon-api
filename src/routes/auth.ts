import { Router } from 'express'
import {
  dbCreatePlayer,
  dbGetPlayerByExternalSource,
  dbLoginPlayer,
  ExternalPlayerReference,
} from '../../nodots_modules/@nodots/backgammon/Player/db'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserInfoResponse as Auth0User } from 'auth0'
import { NodotsPlayerActive } from '../../nodots_modules/@nodots/backgammon-types'

export interface IAuthRouter extends Router {}

export const AuthRouter = (db: NodePgDatabase): IAuthRouter => {
  const router = Router()

  router.get('/', (req, res) => {
    res.send('Welcome to the Nodots Backgammon Auth API!')
  })

  return router
}
