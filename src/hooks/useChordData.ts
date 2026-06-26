import { useState, useEffect } from 'react'
import type { LibraryEntry } from '../types.ts'

const DATA_URLS = [
  '/music-lib/data/chords/guitar-standard.json',
  '/music-lib/data/arpeggios/guitar-standard.json',
]

let cache: LibraryEntry[] | null = null

export function useChordData() {
  const [entries, setEntries] = useState<LibraryEntry[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false
    Promise.all(DATA_URLS.map((url) => fetch(url).then((r) => r.json() as Promise<LibraryEntry[]>).catch(() => [])))
      .then((results) => {
        if (!cancelled) {
          cache = results.flat()
          setEntries(cache)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { entries, loading }
}
