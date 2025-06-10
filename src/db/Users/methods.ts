import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UsersTable } from './schema'
import { ExternalUser } from './types'

export const createUser = async (db: NodePgDatabase, user: ExternalUser) => {
  const newUser = {
    token: user.token,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUri: user.imageUri,
    preferences: user.preferences,
  }
  const [createdUser] = await db.insert(UsersTable).values(newUser).returning()
  return createdUser
}
