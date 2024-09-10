import { Router } from 'express'
import {
  dbCreatePlayerFromAuth0User,
  dbGetPlayerByExternalSource,
  dbLoginPlayer,
  ExternalPlayerReference,
} from '../../nodots_modules/@nodots/backgammon/Player/db'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserInfoResponse as Auth0User } from 'auth0'

export interface IAuthRouter extends Router {}

export const AuthRouter = (db: NodePgDatabase): IAuthRouter => {
  const router = Router()

  router.get('/', (req, res) => {
    res.send('Welcome to the Nodots Backgammon Auth API!')
  })

  router.patch('/', async (req, res) => {
    const user: Auth0User = req.body
    if (!user.sub) {
      return res.status(400).json({ message: 'Invalid Auth0User', user })
    }
    const { sub } = user
    const [source, externalId] = sub.split('|')

    const externalReference: ExternalPlayerReference = { source, externalId }

    let player = await dbGetPlayerByExternalSource(externalReference, db)
    if (player) {
      await dbLoginPlayer(player.id, db)
    }
    return player
      ? res.status(200).json(player)
      : res.status(200).json(await dbCreatePlayerFromAuth0User(user, true, db))
  })

  return router
}
