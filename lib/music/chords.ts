import type { LibraryEntry } from '@/types'

export function parseProgression(raw: string): string[] {
  return raw.split(/[-–—,|]+/).map((s) => s.trim()).filter(Boolean)
}

export function findVoicings(chordName: string, entries: LibraryEntry[]): LibraryEntry[] {
  const needle = chordName.toLowerCase()
  return entries.filter(
    (e) => e.type === 'chord' && (e.name.toLowerCase().includes(needle) || matchChordToken(chordName, e)),
  )
}

function matchChordToken(token: string, entry: LibraryEntry): boolean {
  if (!entry.root || !entry.chord_type) return false
  const root = entry.root.toLowerCase()
  const quality = entry.chord_type.toLowerCase()
  const t = token.toLowerCase()
  if (t === root && quality === 'major') return true
  if ((t === `${root}m` || t === `${root}minor`) && quality === 'minor') return true
  if (t === `${root}7` && quality === '7') return true
  if ((t === `${root}maj7` || t === `${root}M7`) && quality === 'maj7') return true
  if (t === `${root}m7` && quality === 'm7') return true
  if (t === `${root}dim` && quality === 'dim') return true
  if (t === `${root}aug` && quality === 'aug') return true
  if (t === `${root}sus2` && quality === 'sus2') return true
  if (t === `${root}sus4` && quality === 'sus4') return true
  return false
}
