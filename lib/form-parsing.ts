import { parseProgression } from '@/lib/music/chords'
import type { NewSong, NewPlaylist } from '@/lib/db/schema'

export function newSongId() {
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function newPlaylistId() {
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

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

export function parsePlaylistFields(fd: FormData): Omit<NewPlaylist, 'id'> {
  return {
    name: str(fd, 'name'),
    description: strOrNull(fd, 'description'),
    songIds: fd.getAll('songIds') as string[],
    tags: parseTags(fd),
    practiceGoal: strOrNull(fd, 'practiceGoal'),
  }
}
