import cors from 'cors'
import { drizzle } from 'drizzle-orm/node-postgres'
import express from 'express'
import { Client } from 'pg'
import { requestLogger } from './middleware/logger'
import { BoardRouter } from './routes/boards'
import { GamesRouter } from './routes/games'
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

  // Use the request logger middleware
  app.use(requestLogger)

  app.get('/', (req, res) => {
    res.send(
      'Welcome to the Nodots Backgammon API!\n\nhttps://github.com/nodots/nodots-backgammon-api'
    )
  })

  const usersRouter = UsersRouter(db)
  const boardRouter = BoardRouter()
  const gamesRouter = GamesRouter(db)

  // app.use('/auth', authRouter)
  app.use('/users', usersRouter)
  // app.use('/player', playerRouter)
  app.use('/games', gamesRouter)
  app.use('/board', boardRouter)
  // app.use('/offer', offerRouter)

  // Start the server
  app.listen(port, () => {
    console.log(`bgapi> Server is running on http://localhost:${port}`)
  })
}

main()
