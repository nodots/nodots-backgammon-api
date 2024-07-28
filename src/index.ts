import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Client } from 'pg'
import { players as playersTable } from './drizzle-schema/schema'
import {
  PlayerIncoming,
  PlayerInitializing,
} from '../types/@nodots/backgammon/Player'
const app = express()
const port = process.env.PORT || 3000

const client = new Client({
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
    const incomingPlayer: PlayerIncoming = {
      ...req.body,
      kind: 'player-incoming',
    }
    // decode PlayerIncoming to PlayerInitializing
    const player: typeof playersTable.$inferInsert = {
      kind: 'player-initializing',
      externalId: `${req.body.source}:${incomingPlayer.email}`,
      email: incomingPlayer.email,
      locale: incomingPlayer.locale,
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
  app.post('/game', (req, res) => {
    // Logic for starting a game goes here
    res.send('Game started')
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
