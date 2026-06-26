'use client'

import { useCallback } from 'react'
import { useChordData } from '@/hooks/useChordData'
import { findVoicings } from '@/lib/music/chords'
import type { LibraryEntry } from '@/types'

export interface ChordLibrary {
  /** Find voicings for a chord name (e.g. "Am7", "G"). */
  lookup: (chordName: string) => LibraryEntry[]
  /** Filter entries by explicit root + quality for the chord browser. */
  filter: (root: string, quality: string) => LibraryEntry[]
  loading: boolean
}

export function useChordLibrary(): ChordLibrary {
  const { entries, loading } = useChordData()

  const lookup = useCallback(
    (chordName: string) => findVoicings(chordName, entries),
    [entries],
  )

  const filter = useCallback(
    (root: string, quality: string) =>
      entries.filter(
        (e) =>
          e.type === 'chord' &&
          e.root?.toUpperCase() === root.toUpperCase() &&
          e.chord_type === quality,
      ),
    [entries],
  )

  return { lookup, filter, loading }
}
