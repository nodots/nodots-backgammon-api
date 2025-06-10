import { describe, it, expect, jest } from '@jest/globals'
import express from 'express'
import supertest from 'supertest'
import { BoardsRouter } from '../boards'
import { Board } from '@nodots-llc/backgammon-core'

jest.mock('@nodots-llc/backgammon-core', () => ({
  Board: {
    generateRandomBoard: jest.fn(),
    getAsciiBoard: jest.fn(),
  },
}))

const app = express()
const boardRouter = BoardsRouter()
app.use('/board', boardRouter)

describe('Board Routes', () => {
  it('should return a random ascii board', async () => {
    const mockBoard = {} as any
    const mockAsciiBoard = '+13-24-+'

    ;(Board.generateRandomBoard as jest.Mock).mockReturnValue(mockBoard)
    ;(Board.getAsciiBoard as jest.Mock).mockReturnValue(mockAsciiBoard)

    const response = await supertest(app).get('/board')

    expect(response.status).toBe(200)
    expect(response.text).toBe(mockAsciiBoard)
    expect(Board.generateRandomBoard).toHaveBeenCalled()
    expect(Board.getAsciiBoard).toHaveBeenCalledWith(mockBoard)
  })
})
