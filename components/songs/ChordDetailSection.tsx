'use client'

import Link from 'next/link'
import { Music } from 'lucide-react'
import { useChordLibrary } from '@/hooks/useChordLibrary'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import { Card } from '@/components/ui/card'

interface Props { chords: string[] }

export default function ChordDetailSection({ chords }: Props) {
  const { lookup, loading } = useChordLibrary()
  const { prefs } = useApp()

  if (loading) return <p className="text-xs text-muted-foreground">Loading voicings…</p>

  return (
    <div>
      {chords.map((chord) => {
        const voicings = lookup(chord)
        return (
          <div key={chord} className="mb-5">
            <p className="text-sm font-semibold text-foreground mb-2.5">{chord}</p>
            {voicings.length === 0 ? (
              <div className="rounded-lg p-3 flex items-center gap-2 bg-muted border">
                <Music className="size-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  No voicing for {chord}.{' '}
                  <Link href="/chords" className="text-primary hover:text-primary/80">Browse chords →</Link>
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {voicings.slice(0, 4).map((v) => (
                  <Card key={v.id} className="p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      {v.position ?? v.name}
                    </p>
                    {v.diagram && <ChordBox diagram={v.diagram} leftHanded={prefs.leftHanded} />}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
