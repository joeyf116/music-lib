import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { libraryEntries } from '@/lib/db/schema'
import type { LibraryEntry } from '@/types'

export const dynamic = 'force-dynamic'

function rowToEntry(row: typeof libraryEntries.$inferSelect): LibraryEntry {
  return {
    id: row.id,
    type: row.type as LibraryEntry['type'],
    name: row.name,
    instrument: row.instrument as LibraryEntry['instrument'],
    strings: row.strings,
    tuning: row.tuning,
    root: row.root ?? undefined,
    scale_type: row.scaleType ?? undefined,
    chord_type: row.chordType ?? undefined,
    position: row.position ?? undefined,
    fret_range: (row.fretRange as [number, number]) ?? undefined,
    difficulty: row.difficulty ?? undefined,
    tab: row.tab ?? undefined,
    diagram: row.diagram ?? undefined,
    formula: row.formula ?? undefined,
    tags: (row.tags as string[]) ?? [],
  }
}

export async function GET() {
  try {
    const rows = await db.select().from(libraryEntries)
    const entries = rows.map(rowToEntry)
    return NextResponse.json(entries)
  } catch (err) {
    console.error('library API error', err)
    return NextResponse.json({ error: 'Failed to load library' }, { status: 500 })
  }
}
