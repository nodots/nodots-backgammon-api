import { describe, it, expect } from '@jest/globals'
import express from 'express'
import supertest from 'supertest'
import { UsersRouter } from '../users'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

// Mock the drizzle db object
const mockDb = {} as NodePgDatabase

const app = express()
app.use(express.json())
const userRouter = UsersRouter(mockDb)
app.use('/users', userRouter)

describe('User Routes', () => {
  describe('POST /users', () => {
    it('should return the user object that was posted', async () => {
      const fakeUser = {
        sub: 'auth0|123456789',
        given_name: 'Test',
        family_name: 'User',
        nickname: 'testuser',
        name: 'Test User',
        picture: 'http://example.com/testuser.jpg',
        locale: 'en-US',
        updated_at: new Date().toISOString(),
        email: 'testuser@example.com',
        email_verified: true,
      }

      const response = await supertest(app).post('/users').send(fakeUser)

      expect(response.status).toBe(200)
      expect(response.body.incomingUser).toEqual(fakeUser)
    })
  })

  describe('GET /users', () => {
    it('should return 200 OK', async () => {
      const response = await supertest(app).get('/users')
      expect(response.status).toBe(200)
    })
  })
})
