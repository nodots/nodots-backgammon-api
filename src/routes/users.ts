import { Router } from 'express'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UsersTable } from '../db/users'
import { eq } from 'drizzle-orm'

export interface IUsersRouter extends Router {}

export const UsersRouter = (db: NodePgDatabase): IUsersRouter => {
  const router = Router()

  // List all users
  router.get('/', async (req, res) => {
    const users = await db.select().from(UsersTable)
    res.json(users)
  })

  // Get a user by id
  router.get('/:id', async (req, res) => {
    const { id } = req.params
    const user = await db.select().from(UsersTable).where(eq(UsersTable.id, id))
    if (!user.length) return res.status(404).json({ error: 'User not found' })
    res.json(user[0])
  })

  // Create a user
  router.post('/', async (req, res) => {
    const user = req.body
    const result = await db.insert(UsersTable).values(user).returning()
    res.status(201).json(result[0])
  })

  // Delete a user by id
  router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await db.delete(UsersTable).where(eq(UsersTable.id, id))
    res.status(204).send()
  })

  return router
}
