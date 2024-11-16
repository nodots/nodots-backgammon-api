import { NodotsPlayerInitializing } from '@nodots/backgammon'
import {
  createPlayerFromPlayerInitializing,
  getPlayers,
} from '@nodots/backgammon/Player'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
export interface IPlayerRouter extends Router {}

export const PlayerRouter = (db: NodePgDatabase): IPlayerRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    const players = await getPlayers(db)
    res.status(200).json(players)
  })

  router.post('/', async (req, res) => {
    const player = req.body as NodotsPlayerInitializing
    console.log('bg-api> [PlayerRouter] /player POST:', player)

    const playerReady = createPlayerFromPlayerInitializing(player, db)
    if (playerReady) {
      res.status(201).json(playerReady)
    } else {
      res.status(500).json({ message: 'Error creating player' })
    }
  })

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

  router.get(
    '/opponents/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      try {
        const opponents = (await (
          await dbGetPlayers(db)
        ).filter(
          (o) => o.id !== playerId && o.kind === 'ready'
        )) as NodotsPlayerReady[]
        res.status(200).json(opponents)
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
    console.log('bg-api> [PlayerRouter] sub source:', source)
    console.log('bg-api> [PlayerRouter] sub externalId:', externalId)
    try {
      const result = await dbGetPlayerByExternalSource(
        { source, externalId },
        db
      )
      console.log('bg-api> [PlayerRouter] result:', result)
      result ? res.status(200).json(result) : res.status(404).json({})
    } catch {
      res.status(500).json({ message: 'Error retrieving player' })
    }
  })

  router.get('/ready', async (req, res) => {
    const players = await dbGetPlayers(db)
    const readyPlayers = players.filter(
      (player) => player.kind === 'ready'
    ) as NodotsPlayerReady[]
    res.status(200).json(readyPlayers)
  })

  router.patch(
    '/seeking-game/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/',
    async (req, res) => {
      const playerId = req.params.playerId
      console.log('bg-api> [PlayerRouter] seeking-game req.body:', req.body)
      try {
        const player = await dbGetPlayerById(playerId, db)
        if (!player) {
          res
            .status(404)
            .json({ message: `Player not found for id: ${playerId}` })
          return
        }
        const updatedPlayer = await dbSetPlayerSeekingGame(
          playerId,
          !player.isSeekingGame,
          db
        )
        res.status(200).json(updatedPlayer)
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
      console.log('bg-api> [PlayerRouter] logout playerId:', playerId)
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

  router.patch(
    '/login/:playerId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$',
    async (req, res) => {
      const playerId = req.params.playerId
      try {
        const result = await dbLoginPlayer(playerId, db)
        console.log('bg-api> [PlayerRouter] login player result:', result)
        res.status(200).json(result)
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
        const loggedInPlayer = await dbLoginPlayer(playerId, db)
        res.status(200).json(loggedInPlayer)
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
