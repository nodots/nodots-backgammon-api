import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import {
  dbGetPlayerByExternalSource,
  dbGetPlayerById,
  dbGetPlayers,
  dbGetPlayersSeekingGame,
  dbLogoutPlayer,
  dbSetPlayerPlaying,
  dbSetPlayerSeekingGame,
  dbUpdatePlayerPreferences,
} from '../../nodots_modules/@nodots/backgammon/Player/db'

import {
  getPlayerById,
  UpdatedPlayerPreferences,
} from '../../nodots_modules/@nodots/backgammon/Player'
import {
  dbGetAll,
  dbGetReadyGameByPlayerId,
} from '../../nodots_modules/@nodots/backgammon/Game/db'

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

  router.get('/active-game/:playerId', async (req, res) => {
    const playerId = req.params.playerId
    try {
      const playerGames = await dbGetReadyGameByPlayerId(playerId, db)
      console.log(playerGames)
      res.status(200).json(playerGames)
    } catch {
      res
        .status(404)
        .json({ message: `Game not found for player id: ${playerId}` })
    }
  })

  router.get('/sub/:source/:externalId', async (req, res) => {
    const source = req.params.source
    const externalId = req.params.externalId
    try {
      const result = await dbGetPlayerByExternalSource(
        { source, externalId },
        db
      )
      console.log(result)
      res.status(200).json(result)
    } catch {
      res.status(500).json({ message: 'Error retrieving player' })
    }
  })

  router.patch(
    '/playing/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/',
    async (req, res) => {
      const playerId = req.params.playerId
      console.log('[PlayerRouter] playing playerId:', playerId)
      try {
        const player = await dbGetPlayerById(playerId, db)
        if (!player) {
          res
            .status(404)
            .json({ message: `Player not found for id: ${playerId}` })
          return
        }
        if (player.kind !== 'player-ready') {
          res.status(400).json({
            message: `Cannot transition playerId ${playerId} from ${player.kind} to 'player-playing'`,
          })
          return
        }
        await dbSetPlayerPlaying(playerId, db)
        res.status(200).json({
          message: `Player ${playerId} is now kind PlayerPlaying`,
        })
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  router.patch(
    '/seeking-game/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/',
    async (req, res) => {
      const playerId = req.params.playerId
      const seekingGame = req.body.seekingGame
      console.log('[PlayerRouter] seeking-game req.body:', req.body)
      try {
        const player = await dbGetPlayerById(playerId, db)
        if (!player) {
          res
            .status(404)
            .json({ message: `Player not found for id: ${playerId}` })
          return
        }
        await dbSetPlayerSeekingGame(playerId, seekingGame, db)
        res.status(200).json({
          message: `Player seeking game set to: ${!player.isSeekingGame}`,
        })
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  // router.patch(
  //   '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
  //   async (req, res) => {
  //     const playerId = req.params.playerId
  //     const updatedPlayerPreferences: UpdatedPlayerPreferences = req.body
  //     try {
  //       await dbUpdatePlayerPreferences(playerId, updatedPlayerPreferences, db)
  //       res.status(200).json({ message: 'Player preferences updated' })
  //     } catch {
  //       res
  //         .status(404)
  //         .json({ message: `Player not found for id: ${playerId}` })
  //     }
  //   }
  // )

  router.patch(
    '/logout/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      try {
        await dbLogoutPlayer(playerId, db)
        res.status(200).json({ message: 'Player logged out' })
      } catch {
        res
          .status(404)
          .json({ message: `Player not found for id: ${playerId}` })
      }
    }
  )

  // Specialized read
  router.get('/seeking-game', async (req, res) => {
    const players = await dbGetPlayersSeekingGame(db)
    res.status(200).json(players)
  })

  return router
}
