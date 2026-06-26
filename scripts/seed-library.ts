import 'dotenv/config'
import { readFileSync } from 'fs'
import { join } from 'path'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { libraryEntries } from '../lib/db/schema'
import type { LibraryEntry } from '../types'

const DATA_FILES = [
  'public/data/chords/guitar-standard.json',
  'public/data/arpeggios/guitar-standard.json',
  'public/data/scales/guitar-standard.json',
  'public/data/etudes/guitar.json',
  'public/data/licks/guitar.json',
]

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)

  const entries: LibraryEntry[] = DATA_FILES.flatMap((file) => {
    const abs = join(process.cwd(), file)
    try {
      return JSON.parse(readFileSync(abs, 'utf-8')) as LibraryEntry[]
    } catch {
      console.warn(`Skipping ${file} — not found or invalid JSON`)
      return []
    }
  })

  console.log(`Seeding ${entries.length} entries…`)

  const rows = entries.map((e) => ({
    id: e.id,
    type: e.type,
    name: e.name,
    instrument: e.instrument,
    strings: e.strings,
    tuning: e.tuning,
    root: e.root ?? null,
    scaleType: e.scale_type ?? null,
    chordType: e.chord_type ?? null,
    position: e.position ?? null,
    fretRange: e.fret_range ?? null,
    difficulty: e.difficulty ?? null,
    tab: e.tab ?? null,
    diagram: e.diagram ?? null,
    formula: e.formula ?? null,
    tags: e.tags ?? [],
  }))

  // Upsert in batches of 100
  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await db
      .insert(libraryEntries)
      .values(batch)
      .onConflictDoNothing()
    console.log(`  inserted rows ${i + 1}–${i + batch.length}`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
