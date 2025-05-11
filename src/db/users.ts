import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const UsersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  auth0Id: varchar('auth0_id', { length: 128 }).notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  name: varchar('name', { length: 256 }),
  first_name: varchar('first_name', { length: 128 }),
  last_name: varchar('last_name', { length: 128 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
