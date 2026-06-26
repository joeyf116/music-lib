import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { LibraryEntry, AppPreferences } from '../types.ts'
import {
  getRecentlyViewed, addRecentlyViewed,
  getFavorites, toggleFavorite as storageToggleFavorite,
  getPrefs, savePrefs,
} from '../lib/storage/index.ts'

interface AppContextValue {
  recentlyViewed: LibraryEntry[]
  trackViewed: (entry: LibraryEntry) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  prefs: AppPreferences
  updatePrefs: (patch: Partial<AppPreferences>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<LibraryEntry[]>(() => getRecentlyViewed())
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites())
  const [prefs, setPrefs] = useState<AppPreferences>(() => getPrefs())

  useEffect(() => {
    const html = document.documentElement
    if (prefs.theme === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
  }, [prefs.theme])

  const trackViewed = useCallback((entry: LibraryEntry) => {
    addRecentlyViewed(entry)
    setRecentlyViewed(getRecentlyViewed())
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    storageToggleFavorite(id)
    setFavorites(getFavorites())
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const updatePrefs = useCallback((patch: Partial<AppPreferences>) => {
    const next = { ...prefs, ...patch }
    savePrefs(next)
    setPrefs(next)
  }, [prefs])

  return (
    <AppContext.Provider value={{ recentlyViewed, trackViewed, favorites, toggleFavorite, isFavorite, prefs, updatePrefs }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
