import { useState, useEffect, useCallback, useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { LibraryEntry } from './types.ts'
import Header from './components/Header.tsx'
import SearchBar from './components/SearchBar.tsx'
import FilterPanel from './components/FilterPanel.tsx'
import ResultsGrid from './components/ResultsGrid.tsx'
import DetailView from './components/DetailView.tsx'
import RecentlyViewed from './components/RecentlyViewed.tsx'
import { useFilters } from './hooks/useFilters.ts'
import { useSearch } from './hooks/useSearch.ts'

const DATA_FILES = [
  '/music-lib/data/scales/guitar-standard.json',
  '/music-lib/data/chords/guitar-standard.json',
  '/music-lib/data/arpeggios/guitar-standard.json',
  '/music-lib/data/etudes/guitar.json',
  '/music-lib/data/licks/guitar.json',
]

function getInitialTheme(): string {
  if (typeof window === 'undefined') return 'dark'
  return localStorage.getItem('guitarref-theme') ?? 'dark'
}

export default function App() {
  const [theme, setTheme] = useState<string>(getInitialTheme)
  const [allEntries, setAllEntries] = useState<LibraryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<LibraryEntry | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<LibraryEntry[]>([])
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
    localStorage.setItem('guitarref-theme', theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      setLoading(true)
      try {
        const results = await Promise.all(
          DATA_FILES.map((url) =>
            fetch(url)
              .then((r) => r.json() as Promise<LibraryEntry[]>)
              .catch(() => [] as LibraryEntry[]),
          ),
        )
        if (!cancelled) {
          setAllEntries(results.flat())
        }
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  const { filters, setFilter, clearFilters, filtered, activeFilterCount } = useFilters(allEntries)
  const { query, search, results: searchResults } = useSearch(filtered)

  const displayEntries = useMemo(() => {
    if (!query.trim()) return filtered
    return searchResults
  }, [query, filtered, searchResults])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const handleSelect = useCallback((entry: LibraryEntry) => {
    setSelectedEntry(entry)
    setRecentlyViewed((prev) => {
      const without = prev.filter((e) => e.id !== entry.id)
      return [entry, ...without].slice(0, 10)
    })
  }, [])

  const handleClose = useCallback(() => {
    setSelectedEntry(null)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <RecentlyViewed entries={recentlyViewed} onSelect={handleSelect} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 xl:w-72 border-r overflow-y-auto flex-shrink-0"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <FilterPanel
            filters={filters}
            onSetFilter={setFilter}
            onClearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {filterDrawerOpen && (
          <>
            <div
              className="fixed inset-0 z-30 lg:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setFilterDrawerOpen(false)}
              aria-hidden="true"
            />
            <div
              className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto lg:hidden"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  Filters
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--color-muted)', minHeight: '44px', minWidth: '44px' }}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onSetFilter={setFilter}
                onClearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg border relative"
              style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
                minHeight: '44px',
                minWidth: '44px',
              }}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex-1">
              <SearchBar onSearch={search} query={query} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ResultsGrid entries={displayEntries} onSelect={handleSelect} loading={loading} />
          </div>
        </main>
      </div>

      {selectedEntry && (
        <DetailView
          entry={selectedEntry}
          entries={displayEntries}
          onClose={handleClose}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
