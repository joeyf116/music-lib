// ─── Music primitives ──────────────────────────────────────────────────────────

export type Instrument = 'guitar' | 'bass'

export type NoteName =
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E'
  | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab'
  | 'A' | 'A#' | 'Bb' | 'B'

export type ChordQuality =
  | 'major' | 'minor' | '7' | 'maj7' | 'm7'
  | 'sus2' | 'sus4' | 'dim' | 'aug'
  | 'mMaj7' | 'dim7' | 'm7b5'
  | 'add9' | '6' | 'm6' | '9'
  | 'm9' | '11' | '13'

export type PracticeStatus = 'wantToLearn' | 'learning' | 'comfortable' | 'performanceReady'

// ─── Library entry (existing chord/scale JSON shape) ─────────────────────────

export type EntryType = 'scale' | 'chord' | 'arpeggio' | 'etude' | 'lick'

export interface DiagramPosition {
  string: number
  fret: number
  finger: number
  role: 'root' | 'note' | 'muted' | string
}

export interface Barre {
  fret: number
  from_string: number
  to_string: number
}

export interface Diagram {
  type: 'chord' | 'scale' | 'arpeggio'
  tuning: string[]
  positions: DiagramPosition[]
  position_marker: number
  barre?: Barre | null
}

export interface LibraryEntry {
  id: string
  type: EntryType
  name: string
  instrument: Instrument
  strings: number
  tuning: string
  root?: string
  scale_type?: string
  chord_type?: string
  position?: string
  fret_range?: [number, number]
  difficulty?: string
  tab?: string
  diagram?: Diagram
  formula?: string
  tags: string[]
}

// ─── App preferences (localStorage only, not in DB) ──────────────────────────

export interface AppPreferences {
  leftHanded: boolean
}
