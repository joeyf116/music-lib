'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { LibraryEntry, AppPreferences } from '@/types'

const KEYS = {
  recentlyViewed: 'pa:recently-viewed',
  prefs: 'pa:prefs',
} as const

function storageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

function storageSet<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

const DEFAULT_PREFS: AppPreferences = { leftHanded: false }

interface AppContextValue {
  recentlyViewed: LibraryEntry[]
  trackViewed: (entry: LibraryEntry) => void
  prefs: AppPreferences
  updatePrefs: (patch: Partial<AppPreferences>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<LibraryEntry[]>([])
  const [prefs, setPrefs] = useState<AppPreferences>(DEFAULT_PREFS)

  useEffect(() => {
    setRecentlyViewed(storageGet<LibraryEntry[]>(KEYS.recentlyViewed, []))
    setPrefs(storageGet<AppPreferences>(KEYS.prefs, DEFAULT_PREFS))
  }, [])

  const trackViewed = useCallback((entry: LibraryEntry) => {
    setRecentlyViewed((prev) => {
      const next = [entry, ...prev.filter((e) => e.id !== entry.id)].slice(0, 10)
      storageSet(KEYS.recentlyViewed, next)
      return next
    })
  }, [])

  const updatePrefs = useCallback((patch: Partial<AppPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      storageSet(KEYS.prefs, next)
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{ recentlyViewed, trackViewed, prefs, updatePrefs }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
