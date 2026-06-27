'use client'

import { useState, useMemo } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'
import ChordBox from '@/components/diagrams/ChordBox'
import { useApp } from '@/contexts/AppContext'
import type { NoteName } from '@/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const NOTES: NoteName[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const SCALE_TYPES: { value: string; label: string; category: string }[] = [
  { value: 'major',            label: 'Major',            category: 'Diatonic' },
  { value: 'natural_minor',    label: 'Natural Minor',    category: 'Diatonic' },
  { value: 'harmonic_minor',   label: 'Harmonic Minor',   category: 'Diatonic' },
  { value: 'melodic_minor',    label: 'Melodic Minor',    category: 'Diatonic' },
  { value: 'dorian',           label: 'Dorian',           category: 'Mode' },
  { value: 'phrygian',         label: 'Phrygian',         category: 'Mode' },
  { value: 'lydian',           label: 'Lydian',           category: 'Mode' },
  { value: 'mixolydian',       label: 'Mixolydian',       category: 'Mode' },
  { value: 'locrian',          label: 'Locrian',          category: 'Mode' },
  { value: 'major_pentatonic', label: 'Major Pentatonic', category: 'Pentatonic' },
  { value: 'minor_pentatonic', label: 'Minor Pentatonic', category: 'Pentatonic' },
  { value: 'blues',            label: 'Blues',            category: 'Pentatonic' },
]

const CATEGORIES = ['Diatonic', 'Mode', 'Pentatonic'] as const

export default function ScalesClient() {
  const { browseScale, loading } = useLibrary()
  const { prefs } = useApp()
  const [root, setRoot] = useState<NoteName>('A')
  const [scaleType, setScaleType] = useState('minor_pentatonic')

  const results = useMemo(() => browseScale(root, scaleType), [browseScale, root, scaleType])
  const entry = results[0]

  const currentMeta = SCALE_TYPES.find(s => s.value === scaleType)

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h1 className="text-xl font-bold tracking-tight mb-5">Scales</h1>

      {/* Root selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Root</p>
        <ToggleGroup
          value={[root]}
          onValueChange={(vals) => { if (vals.length > 0) setRoot(vals[0] as NoteName) }}
          className="flex flex-wrap gap-1.5 justify-start"
        >
          {NOTES.map((n) => (
            <ToggleGroupItem key={n} value={n} className="rounded-full px-3.5 py-1 text-xs font-medium">
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Scale type selector grouped by category */}
      <div className="mb-7 space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{cat}</p>
            <ToggleGroup
              value={[scaleType]}
              onValueChange={(vals) => { if (vals.length > 0) setScaleType(vals[0]) }}
              className="flex flex-wrap gap-1.5 justify-start"
            >
              {SCALE_TYPES.filter(s => s.category === cat).map(({ value, label }) => (
                <ToggleGroupItem key={value} value={value} className="rounded-full px-3.5 py-1 text-xs font-medium">
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && !entry && (
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold mb-1">No data for {root} {currentMeta?.label}</p>
          <p className="text-sm text-muted-foreground">Try a different root or scale type.</p>
        </Card>
      )}

      {!loading && entry && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">{entry.name}</h2>
            {entry.difficulty && (
              <Badge variant="secondary" className="text-xs">{entry.difficulty}</Badge>
            )}
          </div>

          {/* Formula + Notes */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Formula</p>
              <p className="font-mono text-sm text-foreground">{entry.formula}</p>
            </Card>
            {(entry as any).notes && (
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes in {root}</p>
                <p className="font-mono text-sm text-foreground">{(entry as any).notes}</p>
              </Card>
            )}
          </div>

          {/* Fretboard diagram */}
          {entry.diagram && (
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Box Pattern — {entry.position}
              </p>
              <div className="flex justify-start">
                <ChordBox diagram={entry.diagram} leftHanded={prefs.leftHanded} />
              </div>
            </Card>
          )}

          {/* Tab */}
          {entry.tab && (
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tab</p>
              <pre className="font-mono text-xs text-foreground leading-relaxed whitespace-pre">{entry.tab}</pre>
            </Card>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.filter(t => !NOTES.includes(t as NoteName) && t !== entry.scale_type).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
