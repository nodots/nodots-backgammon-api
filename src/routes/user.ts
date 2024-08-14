import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'

export type Preference = { key: string; value: string | object }

export type GamePreferences = {
  game: string
  preferences: Preference[]
}

export type UserPreferences = {
  username?: string
  gender?: string
  imageUri?: string
  games?: GamePreferences[]
}

export type ExternalUser = {
  token: string
  externalId: string
  email: string
  preferences?: UserPreferences
}

export interface IUserRouter extends Router {}

export const UserRouter = (db: NodePgDatabase): IUserRouter => {
  const router = Router()

  router.get('/', async (req, res) => {})

  router.post('/', async (req, res) => {
    const incomingUser: ExternalUser = req.body

    res.status(200).json({ incomingUser })
  })

  return router
}
