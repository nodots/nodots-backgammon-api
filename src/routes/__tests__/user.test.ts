import { describe, it, expect, jest } from '@jest/globals'
import express from 'express'
import supertest from 'supertest'
import { UsersRouter } from '../users'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ExternalUser } from '../../db/Users/types'
import { InferSelectModel } from 'drizzle-orm'
import { UsersTable } from '../../db/Users/schema'

const fakeUser: ExternalUser = {
  token: 'auth0|123456789',
  externalId: 'auth0|123456789',
  email: 'testuser@example.com',
  firstName: 'Test',
  lastName: 'User',
  imageUri: 'http://example.com/testuser.jpg',
}

type CreatedUser = InferSelectModel<typeof UsersTable>

const createdUser: CreatedUser = {
  id: 'some-random-uuid',
  token: fakeUser.token,
  email: fakeUser.email,
  firstName: fakeUser.firstName,
  lastName: fakeUser.lastName,
  imageUri: fakeUser.imageUri,
  preferences: null,
}

const mockReturning = jest
  .fn<() => Promise<CreatedUser[]>>()
  .mockResolvedValue([createdUser])
const mockValues = jest.fn(() => ({ returning: mockReturning }))
const mockInsert = jest.fn(() => ({ values: mockValues }))

const mockDb = {
  insert: mockInsert,
} as any

const app = express()
app.use(express.json())
const userRouter = UsersRouter(mockDb)
app.use('/users', userRouter)

describe('User Routes', () => {
  describe('POST /users', () => {
    it('should return the user object that was posted', async () => {
      const response = await supertest(app).post('/users').send(fakeUser)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdUser)
      expect(mockInsert).toHaveBeenCalled()
      expect(mockValues).toHaveBeenCalled()
      expect(mockReturning).toHaveBeenCalled()
    })
  })

  describe('GET /users', () => {
    it('should return 200 OK', async () => {
      const response = await supertest(app).get('/users')
      expect(response.status).toBe(200)
    })
  })
})
