import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { findNodotsPlayerFromPlayerKnocking } from '../types/@nodots/backgammon/Player/helpers'
import { PlayerRouter } from './routes/players'
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

  const playerRouter = PlayerRouter(db)
  app.use('/players', playerRouter)

  // Route for starting a game
  app.post('/games', async (req, res) => {
    // Logic for starting a game goes here
    const player1Knocking = req.body.players[0]
    const player2Knocking = req.body.players[1]
    let player1 = await findNodotsPlayerFromPlayerKnocking(player1Knocking)
    let player2 = await findNodotsPlayerFromPlayerKnocking(player2Knocking)
    const nodotsPlayers = [player1, player2]
    console.log('[main] nodotsPlayers:', nodotsPlayers)

    // const players = initializePlayers(player1, player2)
    // const dice = buildDice()
    // const board = buildBoard(players)
    // const cube = buildCube()

    // const game: GameInitialized = {
    //   kind: 'game-initialized',
    //   dice,
    //   board,
    //   cube,
    //   players,
    // }

    res.status(200).json({ message: 'Game started!' })
  })

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
