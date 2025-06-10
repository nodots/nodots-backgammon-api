import { describe, it, expect, jest, afterEach } from '@jest/globals'
import express from 'express'
import supertest from 'supertest'
import { GamesRouter } from '../games'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as gameDb from '../../db/Games'
import {
  BackgammonGame,
  BackgammonGameCompleted,
  BackgammonPlayerInactive,
  BackgammonPlayerWinner,
  BackgammonDiceRolled,
} from '@nodots-llc/backgammon-types'

jest.mock('../../db/Games')

const mockDb = {} as NodePgDatabase

const app = express()
app.use(express.json())
const gameRouter = GamesRouter(mockDb)
app.use('/game', gameRouter)

const mockDice: BackgammonDiceRolled = {
  id: 'dice1',
  color: 'white',
  stateKind: 'rolled',
  currentRoll: [1, 2],
  total: 3,
}

const winnerPlayer: BackgammonPlayerWinner = {
  id: 'user|1',
  color: 'white',
  stateKind: 'winner',
  dice: mockDice,
  direction: 'clockwise',
  pipCount: 0,
  isRobot: false,
}

const loserPlayer: BackgammonPlayerInactive = {
  id: 'user|2',
  color: 'black',
  stateKind: 'inactive',
  dice: {
    id: 'dice2',
    color: 'black',
    stateKind: 'inactive',
  },
  direction: 'clockwise',
  pipCount: 0,
  isRobot: false,
}

const mockGame: BackgammonGameCompleted = {
  id: '123',
  stateKind: 'completed',
  players: [winnerPlayer, loserPlayer],
  board: {} as any,
  cube: {} as any,
  winner: winnerPlayer,
  activeColor: undefined,
  activePlay: undefined,
}
const mockGames: BackgammonGame[] = [mockGame]

describe('Game Routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /game', () => {
    it('should create a game and return 201', async () => {
      const saveGameSpy = jest
        .spyOn(gameDb, 'saveGame')
        .mockResolvedValue(undefined)

      const response = await supertest(app).post('/game').send(mockGame)

      expect(response.status).toBe(201)
      expect(saveGameSpy).toHaveBeenCalledWith(mockGame, mockDb)
    })
  })

  describe('GET /game', () => {
    it('should return a list of games', async () => {
      const getGamesSpy = jest
        .spyOn(gameDb, 'getGames')
        .mockResolvedValue(mockGames)

      const response = await supertest(app).get('/game')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockGames)
      expect(getGamesSpy).toHaveBeenCalledWith(mockDb)
    })
  })

  describe('GET /game/:id', () => {
    it('should return a single game', async () => {
      const getGameSpy = jest
        .spyOn(gameDb, 'getGame')
        .mockResolvedValue(mockGame)

      const response = await supertest(app).get('/game/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockGame)
      expect(getGameSpy).toHaveBeenCalledWith(mockDb, '123')
    })

    it('should return 404 if game not found', async () => {
      const getGameSpy = jest
        .spyOn(gameDb, 'getGame')
        .mockResolvedValue(undefined)

      const response = await supertest(app).get('/game/456')

      expect(response.status).toBe(404)
      expect(getGameSpy).toHaveBeenCalledWith(mockDb, '456')
    })
  })

  describe('PUT /game/:id', () => {
    it('should update a game and return 200', async () => {
      const updateGameSpy = jest
        .spyOn(gameDb, 'updateGame')
        .mockResolvedValue(undefined)

      const response = await supertest(app).put('/game/123').send(mockGame)

      expect(response.status).toBe(200)
      expect(updateGameSpy).toHaveBeenCalledWith(mockDb, mockGame)
    })
  })
})
