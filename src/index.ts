import express from 'express'
import cors from 'cors'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { GamesRouter } from './routes/games'
import { BoardsRouter } from './routes/boards'
import { UsersRouter } from './routes/users'
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
  // FIXME: This is a security risk. Do not use in production.
  app.use(
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    })
  )

  // Define a simple route
  app.get('/', (req, res) => {
    res.send('Welcome to the Nodots Backgammon API!')
  })

  const usersRouter = UsersRouter(db)
  const gamesRouter = GamesRouter(db)
  const boardsRouter = BoardsRouter()

  const v1Router = express.Router()

  v1Router.get('/', (req, res) => {
    res.send('Nodots Backgammon API v1')
  })
  v1Router.use('/users', usersRouter)
  v1Router.use('/games', gamesRouter)
  v1Router.use('/boards', boardsRouter)

  app.use('/api/v1', v1Router)

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
