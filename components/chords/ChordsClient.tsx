'use client'

import { useState, useMemo } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import type { NoteName, ChordQuality } from '@/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Card } from '@/components/ui/card'

const NOTES: NoteName[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const QUALITIES: { value: ChordQuality; label: string }[] = [
  { value: 'major',  label: 'Major'  },
  { value: 'minor',  label: 'Minor'  },
  { value: '7',      label: '7'      },
  { value: 'maj7',   label: 'Maj7'   },
  { value: 'm7',     label: 'm7'     },
  { value: 'mMaj7',  label: 'mMaj7'  },
  { value: 'dim',    label: 'dim'    },
  { value: 'dim7',   label: 'dim7'   },
  { value: 'm7b5',   label: 'm7♭5'   },
  { value: 'aug',    label: 'aug'    },
  { value: 'sus2',   label: 'sus2'   },
  { value: 'sus4',   label: 'sus4'   },
  { value: 'add9',   label: 'add9'   },
  { value: '6',      label: '6'      },
  { value: 'm6',     label: 'm6'     },
  { value: '9',      label: '9'      },
]

export default function ChordsClient() {
  const { browse, loading } = useLibrary()
  const { prefs, trackViewed } = useApp()
  const [root, setRoot] = useState<NoteName>('C')
  const [quality, setQuality] = useState<ChordQuality>('major')

  const voicings = useMemo(() => browse(root, quality), [browse, root, quality])

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h1 className="text-xl font-bold tracking-tight mb-5">Chords</h1>

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

      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quality</p>
        <ToggleGroup
          value={[quality]}
          onValueChange={(vals) => { if (vals.length > 0) setQuality(vals[0] as ChordQuality) }}
          className="flex flex-wrap gap-1.5 justify-start"
        >
          {QUALITIES.map(({ value, label }) => (
            <ToggleGroupItem key={value} value={value} className="rounded-full px-3.5 py-1 text-xs font-medium">
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-foreground">
          {root} {quality === 'major' ? '' : quality}
        </span>
        <span className="text-sm text-muted-foreground">{voicings.length} {voicings.length === 1 ? 'voicing' : 'voicings'}</span>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && voicings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold mb-1">No voicings for {root} {quality}</p>
          <p className="text-sm text-muted-foreground">Try a different root or quality.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {voicings.map((entry) => (
          <button key={entry.id} onClick={() => trackViewed(entry)} className="text-left">
            <Card className="p-3 hover:bg-accent transition-colors cursor-pointer h-full">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                {entry.position ?? entry.name}
              </p>
              {entry.diagram && (
                <div className="overflow-x-auto">
                  <ChordBox diagram={entry.diagram} leftHanded={prefs.leftHanded} />
                </div>
              )}
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
