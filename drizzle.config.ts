import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  schema: process.env.DB_SCHEMA,
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DB_URL ||
      'postgres://<user>:<password>@localhost:5432/<database_name>',
  },
  verbose: true,
  strict: true,
})
