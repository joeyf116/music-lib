'use client'

import { useState, useEffect } from 'react'
import type { LibraryEntry } from '@/types'

// Static JSON served from /public/data — no base path needed in Next.js
const DATA_URLS = [
  '/data/chords/guitar-standard.json',
  '/data/arpeggios/guitar-standard.json',
]

let cache: LibraryEntry[] | null = null

export function useChordData() {
  const [entries, setEntries] = useState<LibraryEntry[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false
    Promise.all(
      DATA_URLS.map((url) => fetch(url).then((r) => r.json() as Promise<LibraryEntry[]>).catch(() => [] as LibraryEntry[]))
    ).then((results) => {
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
