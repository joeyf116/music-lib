import { useState, useMemo } from 'react'
import { useChordData } from '../hooks/useChordData.ts'
import { useApp } from '../contexts/AppContext.tsx'
import ChordBox from '../components/diagrams/ChordBox.tsx'
import type { NoteName, ChordQuality } from '../types.ts'

const NOTES: NoteName[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const QUALITIES: { value: ChordQuality; label: string }[] = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: '7', label: '7' },
  { value: 'maj7', label: 'Maj7' },
  { value: 'm7', label: 'm7' },
  { value: 'sus2', label: 'sus2' },
  { value: 'sus4', label: 'sus4' },
  { value: 'dim', label: 'dim' },
  { value: 'aug', label: 'aug' },
]

export default function ChordsPage() {
  const { entries, loading } = useChordData()
  const { prefs, trackViewed } = useApp()
  const [root, setRoot] = useState<NoteName>('C')
  const [quality, setQuality] = useState<ChordQuality>('major')

  const voicings = useMemo(() =>
    entries.filter(
      (e) =>
        e.type === 'chord' &&
        e.root?.toUpperCase() === root.toUpperCase() &&
        e.chord_type === quality,
    ),
    [entries, root, quality],
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Chords</h1>

      {/* Root selector */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>Root</p>
        <div className="flex flex-wrap gap-2">
          {NOTES.map((n) => (
            <button
              key={n}
              onClick={() => setRoot(n)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors min-w-[2.5rem]"
              style={{
                backgroundColor: root === n ? 'var(--color-accent)' : 'var(--color-surface)',
                color: root === n ? '#fff' : 'var(--color-text)',
                borderColor: root === n ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Quality selector */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>Quality</p>
        <div className="flex flex-wrap gap-2">
          {QUALITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setQuality(value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
              style={{
                backgroundColor: quality === value ? 'var(--color-accent)' : 'var(--color-surface)',
                color: quality === value ? '#fff' : 'var(--color-text)',
                borderColor: quality === value ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ color: 'var(--color-muted)' }}>Loading…</p>}

      {!loading && voicings.length === 0 && (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>No voicings found for {root} {quality}</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Try a different root or quality.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {voicings.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border p-3 cursor-pointer hover:border-orange-500 transition-colors"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            onClick={() => trackViewed(entry)}
          >
            <p className="text-xs font-medium mb-2 truncate" style={{ color: 'var(--color-muted)' }}>
              {entry.position ?? entry.name}
            </p>
            {entry.diagram && (
              <div className="overflow-x-auto">
                <ChordBox diagram={entry.diagram} leftHanded={prefs.leftHanded} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
