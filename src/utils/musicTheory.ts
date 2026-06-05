export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Standard tuning open string semitones (mod 12), index 0 = low E
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4]
export const STANDARD_TUNING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e']

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
  E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8,
  Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
}

const INTERVAL_SEMITONES: Record<string, number> = {
  '1': 0, b2: 1, '#1': 1, '2': 2, b3: 3, '#2': 3,
  '3': 4, '4': 5, b5: 6, '#4': 6, '5': 7, b6: 8,
  '#5': 8, '6': 9, b7: 10, '7': 11,
}

export interface FretNote {
  string: number  // 0 = low E, 5 = high e
  fret: number
  noteName: string
  isRoot: boolean
  semitone: number
}

export function noteToSemitone(note: string): number {
  return NOTE_TO_SEMITONE[note] ?? 0
}

export function parseFormula(formula: string): number[] {
  return formula
    .trim()
    .split(/\s+/)
    .map((interval) => INTERVAL_SEMITONES[interval] ?? 0)
}

export function computeFretboardNotes(
  root: string,
  formula: string,
  tuning: number[] = STANDARD_TUNING,
  numFrets = 14,
): FretNote[] {
  const rootSemitone = noteToSemitone(root)
  const intervals = parseFormula(formula)
  const scaleSemitones = new Set(intervals.map((i) => (rootSemitone + i) % 12))

  const notes: FretNote[] = []
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= numFrets; f++) {
      const semitone = (tuning[s] + f) % 12
      if (scaleSemitones.has(semitone)) {
        notes.push({ string: s, fret: f, noteName: NOTE_NAMES[semitone], isRoot: semitone === rootSemitone, semitone })
      }
    }
  }
  return notes
}
