import express from 'express'
import {
  NodotsPlayer,
  NodotsPlayersInitializing,
  PlayerIncoming,
  PlayerInitializing,
} from '../types/NodotsGame/Player'
const app = express()
const port = process.env.PORT || 3000

// Middleware to parse JSON
app.use(express.json())

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// Route for creating a player
app.post('/player', (req, res) => {
  // Logic for creating a player goes here
  const incomingPlayer: PlayerIncoming = {
    ...req.body,
    kind: 'player-incoming',
  }
  // decode PlayerIncoming as PlayerInitializing
  const player: PlayerInitializing = {
    kind: 'player-initializing',
    externalId: `${req.body.source}:${incomingPlayer.email}`,
    email: incomingPlayer.email,
    locale: incomingPlayer.locale,
    preferences: incomingPlayer.preferences,
    // preferences: {
    //   username: incomingPlayer.preferences.username,
    //   color: incomingPlayer.preferences.color,
    //   direction: incomingPlayer.preferences.direction,
    //   automation: {
    //     roll: incomingPlayer.preferences.automation.roll,
    //     move: incomingPlayer.preferences.automation.move,
    //   },
    // },
  }
  res.json(player)
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
