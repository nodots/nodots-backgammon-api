const { Client } = require('pg')
require('dotenv').config()

const connectionString =
  process.env.DB_URL ||
  'postgres://nodots:nodots@localhost:5432/nodots_backgammon_dev'

async function dropAllTablesAndEnums() {
  const client = new Client({ connectionString })
  await client.connect()
  try {
    // Drop all tables in public schema
    const res = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `)
    for (const row of res.rows) {
      const table = row.tablename
      console.log(`Dropping table: ${table}`)
      await client.query(`DROP TABLE IF EXISTS "public"."${table}" CASCADE;`)
    }
    console.log('All tables dropped.')

    // Drop all enum types in public schema
    const enumRes = await client.query(`
      SELECT t.typname FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname;
    `)
    for (const row of enumRes.rows) {
      const type = row.typname
      console.log(`Dropping enum type: ${type}`)
      await client.query(`DROP TYPE IF EXISTS "public"."${type}" CASCADE;`)
    }
    console.log('All enum types dropped.')
  } finally {
    await client.end()
  }
}

dropAllTablesAndEnums().catch((err) => {
  console.error('Error dropping tables/types:', err)
  process.exit(1)
})
