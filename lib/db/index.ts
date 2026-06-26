import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Lazy singleton — connection is created on first use, not at module load.
// This lets Next.js collect page configuration at build time without
// DATABASE_URL being available.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function getDb() {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!)
    _db = drizzle(sql, { schema })
  }
  return _db
}

export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop: string) {
    return getDb()[prop as keyof ReturnType<typeof getDb>]
  },
})
