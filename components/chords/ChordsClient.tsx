'use client'

import { useState, useMemo } from 'react'
import { useChordLibrary } from '@/hooks/useChordLibrary'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import type { NoteName, ChordQuality } from '@/types'

const NOTES: NoteName[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const QUALITIES: { value: ChordQuality; label: string }[] = [
  { value: 'major', label: 'Major' }, { value: 'minor', label: 'Minor' },
  { value: '7', label: '7' }, { value: 'maj7', label: 'Maj7' },
  { value: 'm7', label: 'm7' }, { value: 'sus2', label: 'sus2' },
  { value: 'sus4', label: 'sus4' }, { value: 'dim', label: 'dim' },
  { value: 'aug', label: 'aug' },
]

export default function ChordsClient() {
  const { filter, loading } = useChordLibrary()
  const { prefs, trackViewed } = useApp()
  const [root, setRoot] = useState<NoteName>('C')
  const [quality, setQuality] = useState<ChordQuality>('major')

  const voicings = useMemo(() => filter(root, quality), [filter, root, quality])

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h1 className="page-title mb-5">Chords</h1>

      <div className="mb-5">
        <p className="section-label mb-2">Root</p>
        <div className="pill-group">
          {NOTES.map((n) => (
            <button key={n} onClick={() => setRoot(n)} className={`pill ${root === n ? 'active' : ''}`}>{n}</button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <p className="section-label mb-2">Quality</p>
        <div className="pill-group">
          {QUALITIES.map(({ value, label }) => (
            <button key={value} onClick={() => setQuality(value)} className={`pill ${quality === value ? 'active' : ''}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>
          {root} {quality === 'major' ? '' : quality}
        </span>
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{voicings.length} {voicings.length === 1 ? 'voicing' : 'voicings'}</span>
      </div>

      {loading && <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Loading…</p>}

      {!loading && voicings.length === 0 && (
        <div className="card p-8 text-center">
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>No voicings for {root} {quality}</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Try a different root or quality.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {voicings.map((entry) => (
          <button key={entry.id} className="card card-hover p-3 text-left" onClick={() => trackViewed(entry)}>
            <p className="section-label mb-2">{entry.position ?? entry.name}</p>
            {entry.diagram && <div className="overflow-x-auto"><ChordBox diagram={entry.diagram} leftHanded={prefs.leftHanded} /></div>}
          </button>
        ))}
      </div>
    </div>
  )
}
