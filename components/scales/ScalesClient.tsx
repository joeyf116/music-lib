'use client'

import { useState, useMemo } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'
import ScaleDiagram from '@/components/diagrams/ScaleDiagram'
import { useApp } from '@/contexts/AppContext'
import type { NoteName } from '@/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const NOTES: NoteName[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const SCALE_GROUPS = [
  {
    label: 'Major & Minor',
    scales: [
      { value: 'major',          label: 'Major'          },
      { value: 'natural_minor',  label: 'Natural Minor'  },
      { value: 'harmonic_minor', label: 'Harmonic Minor' },
      { value: 'melodic_minor',  label: 'Melodic Minor'  },
    ],
  },
  {
    label: 'Modes',
    scales: [
      { value: 'dorian',     label: 'Dorian'     },
      { value: 'phrygian',   label: 'Phrygian'   },
      { value: 'lydian',     label: 'Lydian'      },
      { value: 'mixolydian', label: 'Mixolydian'  },
      { value: 'locrian',    label: 'Locrian'     },
    ],
  },
  {
    label: 'Pentatonic & Blues',
    scales: [
      { value: 'major_pentatonic', label: 'Major Pent.'  },
      { value: 'minor_pentatonic', label: 'Minor Pent.'  },
      { value: 'blues',            label: 'Blues'         },
    ],
  },
]

export default function ScalesClient() {
  const { browseScale, loading } = useLibrary()
  const { prefs } = useApp()
  const [root, setRoot] = useState<NoteName>('A')
  const [scaleType, setScaleType] = useState('minor_pentatonic')

  const entry = useMemo(() => browseScale(root, scaleType)[0], [browseScale, root, scaleType])

  // Split notes string ("A – C – D – E – G") into individual note names
  const noteList = entry?.notes?.split(' – ') ?? []

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-xl font-bold tracking-tight mb-6">Scales</h1>

      {/* Root */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Root note</p>
        <ToggleGroup
          value={[root]}
          onValueChange={(v) => { if (v.length) setRoot(v[0] as NoteName) }}
          className="flex flex-wrap gap-1.5 justify-start"
        >
          {NOTES.map((n) => (
            <ToggleGroupItem key={n} value={n} className="rounded-full px-3 py-1 text-xs font-semibold min-w-[36px] text-center">
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Scale type — grouped */}
      <div className="mb-8 space-y-3">
        {SCALE_GROUPS.map(({ label, scales }) => (
          <div key={label}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</p>
            <ToggleGroup
              value={[scaleType]}
              onValueChange={(v) => { if (v.length) setScaleType(v[0]) }}
              className="flex flex-wrap gap-1.5 justify-start"
            >
              {scales.map(({ value, label: lbl }) => (
                <ToggleGroupItem key={value} value={value} className="rounded-full px-3.5 py-1 text-xs font-medium">
                  {lbl}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && !entry && (
        <p className="text-sm text-muted-foreground">No data found for this selection.</p>
      )}

      {!loading && entry && (
        <div className="space-y-6">

          {/* Scale name + formula */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{entry.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{entry.formula}</p>
          </div>

          {/* Notes in key — pill row */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes in {root}</p>
            <div className="flex flex-wrap gap-2">
              {noteList.map((note, i) => {
                const isRoot = note === root
                return (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isRoot
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {note}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Fretboard diagram */}
          {entry.diagram && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Position 1 — {entry.position}
              </p>
              <div className="inline-block p-3 rounded-xl border border-border bg-card">
                <ScaleDiagram diagram={entry.diagram} leftHanded={prefs.leftHanded} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Accent dot = root note
              </p>
            </div>
          )}

          {/* Tab */}
          {entry.tab && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tab</p>
              <pre className="font-mono text-xs leading-6 text-foreground bg-muted rounded-lg px-4 py-3 w-fit">{entry.tab}</pre>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
