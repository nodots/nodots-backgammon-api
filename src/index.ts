import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { players as playersTable } from './drizzle-schema/schema'
import { PlayerKnocking, PlayerReady } from '../types/@nodots/backgammon/Player'
import {
  assignPlayerColors,
  assignPlayerDirections,
  findNodotsPlayerFromPlayerKnocking,
  initializePlayers,
} from '../types/@nodots/backgammon/Player/helpers'

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
