import express from 'express'
import cors from 'cors'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { PlayerRouter } from './routes/player'
import { GameRouter } from './routes/game'
import { BoardRouter } from './routes/board'
import { UserRouter } from './routes/user'
import { OfferRouter } from './routes/offer'
import { AuthRouter } from './routes/auth'
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

  app.post('/user', (req, res) => {
    res.status(200).json(req.body)
  })

  const authRouter = AuthRouter(db)
  const userRouter = UserRouter(db)
  const playerRouter = PlayerRouter(db)
  const offerRouter = OfferRouter(db)
  const gameRouter = GameRouter(db)
  const boardRouter = BoardRouter()

  app.use('/auth', authRouter)
  app.use('/user', userRouter)
  app.use('/player', playerRouter)
  app.use('/game', gameRouter)
  app.use('/board', boardRouter)
  app.use('/offer', offerRouter)

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
