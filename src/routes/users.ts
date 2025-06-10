import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'
import { createUser } from '../db/Users'
import { ExternalUser } from '../db/Users/types'

export interface IUsersRouter extends Router {}

export const UsersRouter = (db: NodePgDatabase): IUsersRouter => {
  const router = Router()

  router.get('/', async (req, res) => {
    res.status(200).json({ message: 'user get ok' })
  })

  router.post('/', async (req, res) => {
    const incomingUser: ExternalUser = req.body

    try {
      const newUser = await createUser(db, incomingUser)
      res.status(201).json(newUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error creating user' })
    }
  })

  return router
}
