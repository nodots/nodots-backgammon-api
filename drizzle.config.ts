import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://nodots:nodots@localhost:5432/nodots?search_path=nodots_backgammon_dev',
  },
  verbose: true,
  strict: true,
})
