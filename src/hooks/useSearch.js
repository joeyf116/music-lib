import { useState, useMemo, useCallback, useRef } from 'react'
import Fuse from 'fuse.js'

const FUSE_OPTIONS = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'root', weight: 0.2 },
    { name: 'scale_type', weight: 0.15 },
    { name: 'chord_type', weight: 0.15 },
    { name: 'tags', weight: 0.1 },
    { name: 'style', weight: 0.1 },
    { name: 'technique', weight: 0.1 },
    { name: 'formula', weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
}

export function useSearch(allEntries) {
  const [query, setQuery] = useState('')
  const debounceTimer = useRef(null)

  const fuse = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return null
    return new Fuse(allEntries, FUSE_OPTIONS)
  }, [allEntries])

  const search = useCallback((rawQuery) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setQuery(rawQuery)
    }, 200)
  }, [])

  const results = useMemo(() => {
    if (!query.trim() || !fuse) return allEntries
    return fuse.search(query).map((r) => r.item)
  }, [query, fuse, allEntries])

  return { query, search, results }
}
