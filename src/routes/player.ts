import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  dbCreatePlayerFromAuth0User,
  dbGetPlayerByEmail,
  dbGetPlayerById,
  dbGetPlayerBySourceAndExternalId,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbSetPlayerSeekingGame,
} from '../../nodots_modules/@nodots/backgammon/Player/db'

// FIXME: Should import from Auth0 module
export interface Auth0User {
  name?: string
  given_name?: string
  family_name?: string
  middle_name?: string
  nickname?: string
  preferred_username?: string
  profile?: string
  picture?: string
  website?: string
  email?: string
  email_verified?: boolean
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  phone_number?: string
  phone_number_verified?: boolean
  address?: string
  updated_at?: string
  sub?: string
  [key: string]: any
}

export interface IPlayerRouter extends Router {}

export const PlayerRouter = (db: NodePgDatabase): IPlayerRouter => {
  const router = Router()

  router.get('/knocking/:auth0Id', async (req, res) => {
    const [source, externalId] = req.params.auth0Id.split('|')
    try {
      const player = await dbGetPlayerBySourceAndExternalId(
        source,
        externalId,
        db
      )
      if (player.length === 0) {
        const {} = res.status(404).json({
          message: `Player not found for source: ${source} externalId: ${externalId}`,
        })
        return
      }

      res.status(200).json({
        message: `Player knocking for source: ${source} externalId: ${externalId}`,
      })
    } catch {
      res.status(500).json({
        message: `Failed to find player`,
      })
    }
  })

  router.post('/add-auth0-user/', async (req, res) => {
    const externalUser: Auth0User = req.body
    try {
      const player = await dbCreatePlayerFromAuth0User(externalUser, db)
      res.status(200).json(player)
    } catch {
      res.status(500).json({ message: 'Error creating player' })
    }
  })

  router.get('/', async (req, res) => {
    const players = await dbGetPlayers(db)
    res.status(200).json(players)
  })

  router.get(
    '/:email([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+)',
    async (req, res) => {
      try {
        const result = await dbGetPlayerByEmail(req.params.email, db)
        result.length === 0
          ? res.status(404).json({})
          : res.status(200).json(result[0])
      } catch {}
    }
  )

  router.get(
    '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const id = req.params.id
      try {
        const player = await dbGetPlayerById(id, db)
        res.status(200).json(player)
      } catch {
        res.status(404).json({ message: `Player not found for id: ${id}` })
      }
    }
  )

  // Specialized read
  router.get('/seeking-game', async (req, res) => {
    const players = await dbGetPlayersSeekingGame(db)
    res.status(200).json(players)
  })

  // Specialized update
  router.put('/:id/seeking-game', async (req, res) => {
    const id = req.params.id
    try {
      const result = await dbSetPlayerSeekingGame(id, db)
      res.status(200).json(result)
    } catch {
      res.status(500).json({ message: 'Error setting player seeking game' })
    }
  })

  return router
}
