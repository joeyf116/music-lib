'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { LibraryEntry } from '@/types'

interface LibraryContextValue {
  entries: LibraryEntry[]
  loading: boolean
  error: string | null
  /** Fuzzy search by chord name token — e.g. "Am7", "G", "Csus4" */
  search: (name: string) => LibraryEntry[]
  /** Exact filter for the chord browser — root + quality */
  browse: (root: string, quality: string) => LibraryEntry[]
  /** Filter scales by root + scale type */
  browseScale: (root: string, scaleType: string) => LibraryEntry[]
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function matchToken(token: string, entry: LibraryEntry): boolean {
  if (!entry.root || !entry.chord_type) return false
  const root = entry.root.toLowerCase()
  const quality = entry.chord_type.toLowerCase()
  const t = token.toLowerCase()
  if (t === root && quality === 'major') return true
  if ((t === `${root}m` || t === `${root}minor`) && quality === 'minor') return true
  if (t === `${root}7` && quality === '7') return true
  if ((t === `${root}maj7` || t === `${root}m7`) && quality === 'maj7') return true
  if (t === `${root}m7` && quality === 'm7') return true
  if (t === `${root}dim` && quality === 'dim') return true
  if (t === `${root}aug` && quality === 'aug') return true
  if (t === `${root}sus2` && quality === 'sus2') return true
  if (t === `${root}sus4` && quality === 'sus4') return true
  return false
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LibraryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/library')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<LibraryEntry[]>
      })
      .then((data) => {
        if (!cancelled) {
          setEntries(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load library')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const search = useCallback(
    (name: string): LibraryEntry[] => {
      const needle = name.toLowerCase()
      return entries.filter(
        (e) => e.type === 'chord' && (e.name.toLowerCase().includes(needle) || matchToken(name, e)),
      )
    },
    [entries],
  )

  const browse = useCallback(
    (root: string, quality: string): LibraryEntry[] =>
      entries.filter(
        (e) =>
          e.type === 'chord' &&
          e.root?.toUpperCase() === root.toUpperCase() &&
          e.chord_type === quality,
      ),
    [entries],
  )

  const browseScale = useCallback(
    (root: string, scaleType: string): LibraryEntry[] =>
      entries.filter(
        (e) =>
          e.type === 'scale' &&
          e.root?.toUpperCase() === root.toUpperCase() &&
          e.scale_type === scaleType,
      ),
    [entries],
  )

  return (
    <LibraryContext.Provider value={{ entries, loading, error, search, browse, browseScale }}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
