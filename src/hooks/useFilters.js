import { useState, useCallback, useMemo, useEffect } from 'react'

const DEFAULT_FILTERS = {
  instrument: 'guitar',
  strings: '',
  tuning: '',
  contentType: '',
  root: '',
  scaleType: '',
  chordType: '',
  position: '',
  difficulty: '',
  style: '',
}

function readFiltersFromURL() {
  if (typeof window === 'undefined') return DEFAULT_FILTERS
  const params = new URLSearchParams(window.location.search)
  const filters = { ...DEFAULT_FILTERS }
  Object.keys(DEFAULT_FILTERS).forEach((key) => {
    const val = params.get(key)
    if (val !== null) filters[key] = val
  })
  return filters
}

function writeFiltersToURL(filters) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, val]) => {
    if (val && val !== DEFAULT_FILTERS[key]) params.set(key, val)
  })
  const search = params.toString()
  const newURL = search
    ? `${window.location.pathname}?${search}`
    : window.location.pathname
  window.history.replaceState(null, '', newURL)
}

export function useFilters(entries) {
  const [filters, setFilters] = useState(readFiltersFromURL)

  useEffect(() => {
    writeFiltersToURL(filters)
  }, [filters])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, val]) => val && val !== DEFAULT_FILTERS[key]
    ).length
  }, [filters])

  const filtered = useMemo(() => {
    if (!entries || entries.length === 0) return []
    return entries.filter((entry) => {
      if (filters.instrument && entry.instrument !== filters.instrument) return false
      if (filters.strings && String(entry.strings) !== String(filters.strings)) return false
      if (filters.tuning && entry.tuning !== filters.tuning) return false
      if (filters.contentType && entry.type !== filters.contentType) return false
      if (filters.root && entry.root !== filters.root) return false
      if (filters.scaleType && entry.scale_type !== filters.scaleType) return false
      if (filters.chordType && entry.chord_type !== filters.chordType) return false
      if (filters.position && entry.position !== filters.position) return false
      if (filters.difficulty && entry.difficulty !== filters.difficulty) return false
      if (filters.style && entry.style !== filters.style) return false
      return true
    })
  }, [entries, filters])

  return { filters, setFilter, clearFilters, filtered, activeFilterCount }
}
