import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { playlists, songs } from '@/lib/db/schema'
import type { Playlist, NewPlaylist, Song } from '@/lib/db/schema'

export type PlaylistSong = Pick<Song, 'id' | 'title' | 'artist'> & { key: string | null }

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

export function parsePlaylistFields(fd: FormData): Omit<NewPlaylist, 'id'> {
  return {
    name: str(fd, 'name'),
    description: strOrNull(fd, 'description'),
    songIds: fd.getAll('songIds') as string[],
    tags: parseTags(fd),
    practiceGoal: strOrNull(fd, 'practiceGoal'),
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function findAllPlaylists(): Promise<Playlist[]> {
  return db.query.playlists.findMany({ orderBy: (p, { desc }) => [desc(p.createdAt)] })
}

export function findPlaylistById(id: string): Promise<Playlist | undefined> {
  return db.query.playlists.findFirst({ where: eq(playlists.id, id) })
}

export async function findPlaylistWithOrderedSongs(
  id: string,
): Promise<{ playlist: Playlist; songs: PlaylistSong[] } | null> {
  const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, id) })
  if (!playlist) return null

  const songIds = playlist.songIds as string[]
  const rows = songIds.length > 0
    ? await db.query.songs.findMany({ columns: { id: true, title: true, artist: true, key: true } })
    : []

  const map = new Map(rows.map((s) => [s.id, s]))
  const ordered = songIds.map((sid) => map.get(sid)).filter((s): s is PlaylistSong => s != null)

  return { playlist, songs: ordered }
}

// ── Mutations ────────────────────────────────────────────────────────────────

function newPlaylistId() {
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function insertPlaylist(fields: Omit<NewPlaylist, 'id'>): Promise<string> {
  const id = newPlaylistId()
  await db.insert(playlists).values({ id, ...fields })
  return id
}

export async function updatePlaylist(id: string, fields: Omit<NewPlaylist, 'id'>): Promise<void> {
  await db.update(playlists).set({ ...fields, updatedAt: new Date() }).where(eq(playlists.id, id))
}

export async function removePlaylist(id: string): Promise<void> {
  await db.delete(playlists).where(eq(playlists.id, id))
}
