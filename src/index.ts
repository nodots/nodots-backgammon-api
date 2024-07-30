import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { PlayerRouter } from './routes/player'
import { GameRouter } from './routes/game'
const app = express()
const port = process.env.PORT || 3000

export const nodotsDbClient = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'nodots',
  password: 'nodots',
  database: 'nodots_backgammon_dev',
})

const main = async () => {
  await nodotsDbClient.connect()
  const db = drizzle(nodotsDbClient)

  // Middleware to parse JSON
  app.use(express.json())

  // Define a simple route
  app.get('/', (req, res) => {
    res.send('Hello, world!')
  })

  const playerRouter = PlayerRouter(db)
  const gameRouter = GameRouter(db)

  app.use('/player', playerRouter)
  app.use('/game', gameRouter)

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
