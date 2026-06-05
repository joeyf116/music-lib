export type EntryType = 'scale' | 'chord' | 'arpeggio' | 'etude' | 'lick';
export type Instrument = 'guitar' | 'bass';

export interface DiagramPosition {
  string: number;
  fret: number;
  finger: number;
  role: 'root' | 'note' | 'muted' | string;
}

export interface Barre {
  fret: number;
  from_string: number;
  to_string: number;
}

export interface Diagram {
  type: 'chord' | 'scale' | 'arpeggio';
  tuning: string[];
  positions: DiagramPosition[];
  position_marker: number;
  barre?: Barre | null;
}

export interface LibraryEntry {
  id: string;
  type: EntryType;
  name: string;
  instrument: Instrument;
  strings: number;
  tuning: string;
  root?: string;
  scale_type?: string;
  chord_type?: string;
  position?: string;
  fret_range?: [number, number];
  difficulty?: string;
  tab?: string;
  diagram?: Diagram;
  formula?: string;
  tags: string[];
  bpm?: number;
  time_signature?: string;
  technique?: string;
  style?: string;
  context?: string;
}

export interface Filters {
  instrument: string;
  strings: string;
  tuning: string;
  contentType: string;
  root: string;
  scaleType: string;
  chordType: string;
  position: string;
  difficulty: string;
  style: string;
}
