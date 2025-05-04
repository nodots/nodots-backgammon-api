import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { BoardRouter } from './routes/board'
import { AuthRouter } from './routes/auth'
import cors from 'cors'
import { requestLogger } from './middleware/logger'
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
  // const db = drizzle(nodotsDbClient)

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

  // app.post('/user', (req, res) => {
  //   res.status(200).json(req.body)
  // })

  // const authRouter = AuthRouter(db)
  // const userRouter = UserRouter(db)
  // const playerRouter = PlayerRouter(db)
  // const offerRouter = OfferRouter(db)
  // const gameRouter = GameRouter(db)
  const boardRouter = BoardRouter()

  // app.use('/auth', authRouter)
  // app.use('/user', userRouter)
  // app.use('/player', playerRouter)
  // app.use('/game', gameRouter)
  app.use('/board', boardRouter)
  // app.use('/offer', offerRouter)

  // Start the server
  app.listen(port, () => {
    console.log(`bgapi> Server is running on http://localhost:${port}`)
  })
}

main()
