'use client'

import Link from 'next/link'
import { Music } from 'lucide-react'
import { useChordData } from '@/hooks/useChordData'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import { findVoicings } from '@/lib/music/chords'

interface Props { chords: string[] }

export default function ChordDetailSection({ chords }: Props) {
  const { entries, loading } = useChordData()
  const { prefs } = useApp()

  if (loading) return <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>Loading voicings…</p>

  return (
    <div>
      {chords.map((chord) => {
        const voicings = findVoicings(chord, entries)
        return (
          <div key={chord} className="mb-5">
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>{chord}</p>
            {voicings.length === 0 ? (
              <div className="rounded-lg p-3 flex items-center gap-2" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <Music size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  No voicing for {chord}.{' '}
                  <Link href="/chords" style={{ color: 'var(--color-accent)' }}>Browse chords →</Link>
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {voicings.slice(0, 4).map((v) => (
                  <div key={v.id} className="card p-3">
                    <p className="section-label mb-2">{v.position ?? v.name}</p>
                    {v.diagram && <ChordBox diagram={v.diagram} leftHanded={prefs.leftHanded} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
