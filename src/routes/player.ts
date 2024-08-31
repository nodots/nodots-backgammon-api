import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  dbCreatePlayerFromAuth0User,
  dbGetPlayerByEmail,
  dbGetPlayerById,
  dbGetPlayerBySourceAndExternalIdAndKind,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbLogoutPlayer,
  dbSetPlayerSeekingGame,
  dbUpdatePlayerPreferences,
} from '../../nodots_modules/@nodots/backgammon/Player/db'

import { UpdatedPlayerPreferences } from '../../nodots_modules/@nodots/backgammon/Player'

export interface IPlayerRouter extends Router {}

export const PlayerRouter = (db: NodePgDatabase): IPlayerRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const players = await dbGetPlayers(db)
    res.status(200).json(players)
  })

  // router.get(
  //   '/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
  //   async (req, res) => {
  //     const playerId = req.params.playerId
  //       try {
  //         const player = await dbGetPlayerById(playerId, db)
  //         res.status(200).json(player)
  //       } catch {
  //         res
  //           .status(404)
  //           .json({ message: `Player not found for id: ${playerId}` })
  //       }
  //     }
  //   }
  router.get(
    '/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      try {
        const player = await dbGetPlayerById(playerId, db)
        res.status(200).json(player)
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  router.get('/sub/:source/:externalId', async (req, res) => {
    const source = req.params.source
    const externalId = req.params.externalId
    try {
      const result = await dbGetPlayerBySourceAndExternalIdAndKind(
        source,
        externalId,
        db
      )
      console.log(result)
      res.status(200).json(result)
    } catch {
      res.status(500).json({ message: 'Error retrieving player' })
    }
  })

  router.get(
    '/email/:email([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+)',
    async (req, res) => {
      try {
        const result = await dbGetPlayerByEmail(req.params.email, db)
        result.length === 0
          ? res.status(404).json({})
          : res.status(200).json(result[0])
      } catch {}
    }
  )

  router.patch(
    '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      const updatedPlayerPreferences: UpdatedPlayerPreferences = req.body
      try {
        await dbUpdatePlayerPreferences(playerId, updatedPlayerPreferences, db)
        res.status(200).json({ message: 'Player preferences updated' })
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  router.patch(
    '/logout/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      try {
        await dbLogoutPlayer(playerId, db)
        res.status(200).json({ message: 'Player preferences updated' })
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  router.patch('/set-seeking-game/:playerId', async (req, res) => {
    console.log('req.body', req.body)
    const kind = req.body.kind
    const playerId = req.params.playerId
    try {
      const result = await dbSetPlayerSeekingGame(playerId, kind, db)
      console.log('******', result)
      res.status(200).json(result)
    } catch {
      res.status(500).json({ message: 'Error setting player seeking game' })
    }
  })

  // Specialized read
  router.get('/seeking-game', async (req, res) => {
    const players = await dbGetPlayersSeekingGame(db)
    res.status(200).json(players)
  })

  return router
}
