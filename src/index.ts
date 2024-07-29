import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { players as playersTable } from './drizzle-schema/schema'
import { PlayerKnocking, PlayerReady } from '../types/@nodots/backgammon/Player'
import {
  assignPlayerColors,
  assignPlayerDirections,
  findNodotsPlayerFromPlayerKnocking,
} from '../types/@nodots/backgammon/Player/helpers'
import { NodotsColor, NodotsMoveDirection } from '../types'
const app = express()
const port = process.env.PORT || 3000

export const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'nodots',
  password: 'nodots',
  database: 'nodots_backgammon_dev',
})

const main = async () => {
  await client.connect()
  const db = drizzle(client)

  // Middleware to parse JSON
  app.use(express.json())

  // Define a simple route
  app.get('/', (req, res) => {
    res.send('Hello, world!')
  })

  app.get('/players', async (req, res) => {
    const players = await db.select().from(playersTable)
    res.status(200).json(players)
  })

  // Route for creating a player
  app.post('/players', async (req, res) => {
    // Logic for creating a player goes here
    const incomingPlayer: PlayerKnocking = {
      ...req.body,
      kind: 'player-knocking',
    }
    // decode PlayerIncoming to PlayerInitializing
    const player: typeof playersTable.$inferInsert = {
      kind: 'player-initializing',
      externalId: `${req.body.source}:${incomingPlayer.email}`,
      email: incomingPlayer.email,
      preferences: incomingPlayer.preferences,
    }
    try {
      await db.insert(playersTable).values(player)
      res.status(200).json(player)
    } catch (error) {
      console.error('Error inserting player into the database:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  const transmogrifyPlayer = (
    player: PlayerKnocking,
    color: NodotsColor,
    direction: NodotsMoveDirection
  ): PlayerReady => {
    return {
      ...player,
      kind: 'player-ready',
      color,
      direction,
    }
  }

  const initializePlayers = (
    player1: PlayerReady | PlayerKnocking,
    player2: PlayerReady | PlayerKnocking
  ): [PlayerReady, PlayerReady] => {
    console.log('[initializePlayers] player1:', player1)
    console.log('[initializePlayers] player2:', player2)

    const colors = assignPlayerColors(player1, player2)
    const directions = assignPlayerDirections(player1, player2)

    let playerReady1: PlayerReady
    let playerReady2: PlayerReady

    playerReady1 =
      player1.kind === 'player-knocking'
        ? transmogrifyPlayer(player1, colors[0], directions[0])
        : {
            ...player1,
            kind: 'player-ready',
          }
    playerReady2 =
      player2.kind === 'player-knocking'
        ? transmogrifyPlayer(player2, colors[1], directions[1])
        : {
            ...player2,
            kind: 'player-ready',
          }

    return [playerReady1, playerReady2]
  }

  // Route for starting a game
  app.post('/games', async (req, res) => {
    // Logic for starting a game goes here
    const { players } = req.body
    const player1Knocking = players[0]
    const player2Knocking = players[1]
    let player1 = await findNodotsPlayerFromPlayerKnocking(player1Knocking)
    let player2 = await findNodotsPlayerFromPlayerKnocking(player2Knocking)
    const nodotsPlayers = [player1, player2]
    console.log('[main] nodotsPlayers:', nodotsPlayers)

    const playersReady = initializePlayers(player1, player2)

    res.status(200).json(playersReady)
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
