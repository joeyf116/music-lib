import type { LibraryEntry } from '../../types.ts'

export function parseProgression(raw: string): string[] {
  return raw
    .split(/[-–—,|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function findVoicings(chordName: string, entries: LibraryEntry[]): LibraryEntry[] {
  const needle = chordName.toLowerCase()
  return entries.filter(
    (e) =>
      e.type === 'chord' &&
      (e.name.toLowerCase().includes(needle) ||
        e.root?.toLowerCase() === needle ||
        matchChordToken(chordName, e)),
  )
}

function matchChordToken(token: string, entry: LibraryEntry): boolean {
  if (!entry.root || !entry.chord_type) return false
  const root = entry.root.toLowerCase()
  const quality = entry.chord_type.toLowerCase()
  const t = token.toLowerCase()

  // "C" → major
  if (t === root && quality === 'major') return true
  // "Cm" or "C minor"
  if ((t === `${root}m` || t === `${root}minor`) && quality === 'minor') return true
  // "C7"
  if (t === `${root}7` && quality === '7') return true
  // "Cmaj7"
  if ((t === `${root}maj7` || t === `${root}M7`) && quality === 'maj7') return true
  // "Cm7"
  if (t === `${root}m7` && quality === 'm7') return true
  // "Cdim"
  if (t === `${root}dim` && quality === 'dim') return true
  // "Caug"
  if (t === `${root}aug` && quality === 'aug') return true
  // "Csus2" / "Csus4"
  if (t === `${root}sus2` && quality === 'sus2') return true
  if (t === `${root}sus4` && quality === 'sus4') return true

  return false
}
