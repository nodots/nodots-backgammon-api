import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core'

export const player = pgTable('player', {
  id: serial('id'),
  email: text('email'),
  locale: text('locale'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
