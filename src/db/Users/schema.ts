import { pgTable, text, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { UserPreferences } from './types'

export const UsersTable = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),
  token: text('token').notNull(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUri: text('image_uri'),
  preferences: jsonb('preferences').$type<UserPreferences>(),
})
