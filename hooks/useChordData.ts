'use client'

import { useState, useEffect } from 'react'
import type { LibraryEntry } from '@/types'

let cache: LibraryEntry[] | null = null

export function useChordData() {
  const [entries, setEntries] = useState<LibraryEntry[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    if (cache !== null) return
    let cancelled = false
    fetch('/api/library')
      .then((r) => r.json() as Promise<LibraryEntry[]>)
      .catch(() => [] as LibraryEntry[])
      .then((data) => {
        if (!cancelled) {
          cache = Array.isArray(data) ? data : []
          setEntries(cache)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { entries, loading }
}
