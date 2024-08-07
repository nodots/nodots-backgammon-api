import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  schema: process.env.DB_SCHEMA || './src/drizzle-schema/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DB_URL ||
      'postgres://nodots:nodots@localhost:5432/nodots_backgammon_dev',
  },
  verbose: true,
  strict: true,
})
