import { Router } from 'express'
import {
  dbCreatePlayerFromAuth0User,
  dbGetPlayerBySourceAndExternalId,
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

    let player = await dbGetPlayerBySourceAndExternalId(source, externalId, db)

    return player
      ? res.status(200).json(player)
      : res.status(200).json(await dbCreatePlayerFromAuth0User(user, true, db))
  })

  return router
}

/*
    const user: Auth0User = req.body
    console.log(user)

    if (!user.sub) {
      res.status(400).json({ message: 'sub is required', user })
      return router
    }

    const [source, externalId] = user.sub.split('|')

    try {
      const player = await dbGetPlayerBySourceAndExternalId(
        source,
        externalId,
        db
      )
      console.log('Found player:', player)
      if (player) {
        res.status(200).json(player)
      } else {
        const player = await dbCreatePlayerFromAuth0User(user, db)
        console.log('Created player:', player)
        res.status(200).json(player)
      }
    } catch {
      console.error('Error getting player')
      res.status(500).json({ message: 'Error getting player' })
    }
      */
