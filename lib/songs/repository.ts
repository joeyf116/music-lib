import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import type { Song, NewSong } from '@/lib/db/schema'
import { parseProgression } from '@/lib/music/chords'

export const STATUS_LABELS = {
  wantToLearn: 'Want to learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance ready',
} as const

export type SongSummary = Pick<Song, 'id' | 'title' | 'artist'>

// ── Form parsing ─────────────────────────────────────────────────────────────

function str(fd: FormData, key: string): string {
  return fd.get(key) as string
}

function strOrNull(fd: FormData, key: string): string | null {
  return (fd.get(key) as string) || null
}

function parseTags(fd: FormData): string[] {
  const raw = str(fd, 'tags')
  return raw ? raw.split(',').map((t) => t.trim()).filter(Boolean) : []
}

export function parseSongFields(fd: FormData): Omit<NewSong, 'id'> {
  return {
    title: str(fd, 'title'),
    artist: str(fd, 'artist'),
    key: strOrNull(fd, 'key'),
    capo: strOrNull(fd, 'capo'),
    tuning: strOrNull(fd, 'tuning'),
    difficulty: strOrNull(fd, 'difficulty'),
    instrumentFocus: str(fd, 'instrumentFocus') || 'guitar',
    spotifyUrl: strOrNull(fd, 'spotifyUrl'),
    tabUrl: strOrNull(fd, 'tabUrl'),
    youtubeUrl: strOrNull(fd, 'youtubeUrl'),
    chordProgression: parseProgression((fd.get('chordProgression') as string) ?? ''),
    notes: strOrNull(fd, 'notes'),
    tags: parseTags(fd),
    practiceStatus: str(fd, 'practiceStatus') || 'wantToLearn',
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function findAllSongs(): Promise<Song[]> {
  return db.query.songs.findMany({ orderBy: (s, { desc }) => [desc(s.createdAt)] })
}

export function findSongById(id: string): Promise<Song | undefined> {
  return db.query.songs.findFirst({ where: eq(songs.id, id) })
}

export async function findSongSummaries(): Promise<SongSummary[]> {
  return db.query.songs.findMany({ columns: { id: true, title: true, artist: true } })
}

export async function findAllSongIds(): Promise<Set<string>> {
  const rows = await db.query.songs.findMany({ columns: { id: true } })
  return new Set(rows.map((r) => r.id))
}

// ── Mutations ────────────────────────────────────────────────────────────────

function newSongId() {
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function insertSong(fields: Omit<NewSong, 'id'>): Promise<string> {
  const id = newSongId()
  await db.insert(songs).values({ id, ...fields })
  return id
}

export async function updateSong(id: string, fields: Omit<NewSong, 'id'>): Promise<void> {
  await db.update(songs).set({ ...fields, updatedAt: new Date() }).where(eq(songs.id, id))
}

export async function removeSong(id: string): Promise<void> {
  await db.delete(songs).where(eq(songs.id, id))
}
