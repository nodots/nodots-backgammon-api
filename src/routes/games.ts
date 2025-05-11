import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import { Board, Game } from 'nodots-backgammon-core'
import {
  BackgammonGameMoving,
  BackgammonGameRollingForStart,
  BackgammonMove,
} from 'nodots-backgammon-types'
import { dbCreateGame, dbGetGame, dbUpdateGame } from '../db/games'

export interface IGamesRouter extends Router {}

export const GamesRouter = (db: NodePgDatabase): IGamesRouter => {
  const router = Router()

  // List all games (placeholder)
  router.get('/', async (req, res) => {
    res.send('Welcome to the Nodots Backgammon Game API!')
  })

  // Create a new game
  router.post('/', async (req, res) => {
    const players = req.body.players
    let game = Game.initialize(players)
    const rollingForStartGame = {
      ...game,
      stateKind: 'rolling-for-start',
    } as import('nodots-backgammon-types').BackgammonGameRollingForStart
    const rollingGame = Game.rollForStart(rollingForStartGame)
    // Manually construct BackgammonGameRolledForStart
    const rolledForStartGame = {
      ...rollingGame,
      stateKind: 'rolled-for-start',
      activeColor: rollingGame.activeColor,
      activePlayer: rollingGame.activePlayer,
      inactivePlayer: rollingGame.inactivePlayer,
    } as import('nodots-backgammon-types').BackgammonGameRolledForStart
    try {
      const dbGame = await dbCreateGame(rolledForStartGame, db)
      res.status(201).json(dbGame)
    } catch (err) {
      const error = err as Error
      res.status(400).json({ error: error.message })
    }
  })

  // Get a game by id (placeholder)
  router.get('/:id', async (req, res) => {
    const gameId = req.params.id
    const result = await dbGetGame(gameId, db)
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Game not found' })
    }
    res.json(result[0])
  })

  // Player rolls the dice
  router.patch('/:id/roll', async (req, res) => {
    const gameId = req.params.id
    const result = await dbGetGame(gameId, db)
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Game not found' })
    }

    const game = result[0]
    switch (game.stateKind) {
      case 'rolling-for-start':
      case 'moving':
      case 'rolled':
      case 'completed':
        return res
          .status(400)
          .json({ error: `Invalid game state for 'roll': ${game.stateKind}` })
      case 'rolled-for-start': {
        // Allow rolling in 'rolled-for-start' state
        const typedGame = {
          ...game,
          players:
            game.players as import('nodots-backgammon-types').BackgammonPlayers,
        } as import('nodots-backgammon-types').BackgammonGameRolledForStart
        const rolledGame = Game.roll(typedGame)
        const dbGame = await dbUpdateGame(rolledGame, db)
        return res.status(200).json(dbGame)
      }
      case 'rolling': {
        console.log('rolling', game)
        // Transition to 'rolling-for-start' first if needed
        const rollingForStartGame = {
          ...game,
          stateKind: 'rolling-for-start',
        } as BackgammonGameRollingForStart
        const rollingGame = Game.rollForStart(rollingForStartGame)
        // Manually construct BackgammonGameRolledForStart
        const rolledForStartGame = {
          ...rollingGame,
          stateKind: 'rolled-for-start',
          activeColor: rollingGame.activeColor,
          activePlayer: rollingGame.activePlayer,
          inactivePlayer: rollingGame.inactivePlayer,
        } as import('nodots-backgammon-types').BackgammonGameRolledForStart
        const rolledGame = Game.roll(rolledForStartGame)
        console.log('rolledGame', rolledGame)
        const dbGame = await dbUpdateGame(rolledGame, db)
        return res.status(200).json(dbGame)
      }
    }
  })

  router.patch('/:id/move/:originId', async (req, res) => {
    const gameId = req.params.id
    const originId = req.params.originId
    const result = await dbGetGame(gameId, db)
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Game not found' })
    }

    const game = result[0]
    switch (game.stateKind) {
      case 'rolling-for-start':
      case 'rolled-for-start':
      case 'rolling':
      case 'completed':
        return res
          .status(400)
          .json({ error: `Invalid game state for 'move': ${game.stateKind}` })
      case 'moving':
        const movingGame = game as BackgammonGameMoving
        const { activePlayer } = movingGame
        const direction = activePlayer.direction
        const movesArray = Array.from(
          movingGame.activePlay.moves
        ) as BackgammonMove[]
        console.log('movingGame', movingGame)
        const activeMove = movesArray.find(
          (m) => m.stateKind === 'in-progress' && m.origin === undefined
        )
        if (!activeMove) {
          return res
            .status(400)
            .json({ error: 'No valid move found', movesArray })
        }
        let origin
        if (originId === 'bar') {
          origin = getBar(movingGame.board, originId, direction)
        } else {
          origin = getPoint(movingGame.board, originId)
        }
        if (!origin) {
          return res.status(400).json({ error: 'Invalid origin' })
        }
        const movedGame = Game.move(movingGame, origin)
        const dbGame = await dbUpdateGame(movedGame, db)
        return res.status(200).json(dbGame)
    }
  })

  return router
}

// Utility functions for Board
function getBar(board: any, id: string, direction: string) {
  const bars = Board.getBars(board)
  return bars.find((bar: any) => bar.id === id && bar.direction === direction)
}

function getPoint(board: any, id: string) {
  const points = Board.getPoints(board)
  return points.find((point: any) => point.id === id)
}
