import type { Song, Playlist, AppPreferences, LibraryEntry } from '../../types.ts'

const KEYS = {
  songs: 'pa:songs',
  playlists: 'pa:playlists',
  prefs: 'pa:prefs',
  recentlyViewed: 'pa:recently-viewed',
  favorites: 'pa:favorites',
} as const

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Songs ────────────────────────────────────────────────────────────────────

export function getSongs(): Song[] {
  return get<Song[]>(KEYS.songs, [])
}

export function saveSong(song: Song): void {
  const songs = getSongs().filter((s) => s.id !== song.id)
  set(KEYS.songs, [...songs, song])
}

export function deleteSong(id: string): void {
  set(KEYS.songs, getSongs().filter((s) => s.id !== id))
}

// ─── Playlists ────────────────────────────────────────────────────────────────

export function getPlaylists(): Playlist[] {
  return get<Playlist[]>(KEYS.playlists, [])
}

export function savePlaylist(playlist: Playlist): void {
  const playlists = getPlaylists().filter((p) => p.id !== playlist.id)
  set(KEYS.playlists, [...playlists, playlist])
}

export function deletePlaylist(id: string): void {
  set(KEYS.playlists, getPlaylists().filter((p) => p.id !== id))
}

// ─── Preferences ──────────────────────────────────────────────────────────────

const DEFAULT_PREFS: AppPreferences = { leftHanded: false, theme: 'dark' }

export function getPrefs(): AppPreferences {
  return get<AppPreferences>(KEYS.prefs, DEFAULT_PREFS)
}

export function savePrefs(prefs: AppPreferences): void {
  set(KEYS.prefs, prefs)
}

// ─── Recently viewed ──────────────────────────────────────────────────────────

export function getRecentlyViewed(): LibraryEntry[] {
  return get<LibraryEntry[]>(KEYS.recentlyViewed, [])
}

export function addRecentlyViewed(entry: LibraryEntry): void {
  const prev = getRecentlyViewed().filter((e) => e.id !== entry.id)
  set(KEYS.recentlyViewed, [entry, ...prev].slice(0, 10))
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function getFavorites(): string[] {
  return get<string[]>(KEYS.favorites, [])
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites()
  const isFav = favs.includes(id)
  set(KEYS.favorites, isFav ? favs.filter((f) => f !== id) : [...favs, id])
  return !isFav
}
