import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Client } from 'pg'
import { players as playersTable } from './drizzle-schema/schema'
import {
  PlayerInitializing,
  PlayerKnocking,
} from '../types/@nodots/backgammon/Player'
import chalk from 'chalk'
const app = express()
const port = process.env.PORT || 3000

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'nodots',
  password: 'nodots',
  database: 'nodots_backgammon_dev',
})

const findNodotsPlayer = async (player: PlayerKnocking) => {
  console.log('[findNodotsPlayer] player:', player)
  const foundPlayers = await client.query(
    `SELECT * FROM players WHERE email = $1`,
    [player.email]
  )
  let foundPlayer: PlayerInitializing | PlayerKnocking
  if (foundPlayers.rows.length === 1) {
    foundPlayer = foundPlayers.rows[0]
  } else {
    foundPlayer = {
      kind: 'player-knocking',
      source: player.source,
      email: player.email,
    }
  }
  return foundPlayer
}

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

  const transmogrifyPlayer = async (player: PlayerKnocking) => {
    const nodotsPlayer = await db.insert(playersTable).values({
      ...player,
      externalId: `${player.source}:${player.email}`,
      kind: 'player-ready',
    })
    console.log('[transmogrifyPlayer] nodotsPlayer:', nodotsPlayer)
    return nodotsPlayer
  }

  // Route for starting a game
  app.post('/games', async (req, res) => {
    // Logic for starting a game goes here
    const { players } = req.body
    const player1Knocking = players[0]
    const player2Knocking = players[1]
    let player1 = await findNodotsPlayer(player1Knocking)
    let player2 = await findNodotsPlayer(player2Knocking)
    const nodotsPlayers = [player1, player2]
    console.log('[main] nodotsPlayers:', nodotsPlayers)

    if (player1.kind === 'player-knocking') {
      const playerCandidate = await transmogrifyPlayer(player1)
      console.log(playerCandidate)
    }

    if (player2.kind === 'player-knocking') {
      transmogrifyPlayer(player2)
    }

    res
      .status(200)
      .json({ msg: 'Game initializing with external players:', nodotsPlayers })
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
