import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  dbCreatePlayerFromAuth0User,
  dbFetchPlayerById,
  dbFetchPlayerBySourceAndExternalId,
  dbFetchPlayers,
  dbFetchPlayersSeekingGame,
  dbSetPlayerSeekingGame,
} from '../../nodots_modules/@nodots/backgammon/Player/db'
import {
  initializePlayer,
  PlayerKnocking,
} from '../../nodots_modules/@nodots/backgammon/Player'

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
      const player = await dbFetchPlayerBySourceAndExternalId(
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

  router.post('/knocking/', async (req, res) => {
    const auth0User: Auth0User = req.body
    try {
      const player = await dbCreatePlayerFromAuth0User(auth0User, db)
      res.status(200).json(player)
    } catch {
      res.status(500).json({ message: 'Error creating player' })
    }
  })

  router.get('/', async (req, res) => {
    const players = await dbFetchPlayers(db)
    res.status(200).json(players)
  })

  router.get(
    '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const id = req.params.id
      try {
        const player = await dbFetchPlayerById(id, db)
        res.status(200).json(player)
      } catch {
        res.status(404).json({ message: `Player not found for id: ${id}` })
      }
    }
  )

  // FIXME id/seeking-game are both strings so this is a hack
  // Specialized read
  router.get('/seeking-game', async (req, res) => {
    const players = await dbFetchPlayersSeekingGame(db)
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
