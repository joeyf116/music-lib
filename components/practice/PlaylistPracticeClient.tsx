'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PracticeClient from './PracticeClient'
import type { Song } from '@/lib/db/schema'

interface Props { songs: Song[]; playlistName: string }

export default function PlaylistPracticeClient({ songs, playlistName }: Props) {
  const [idx, setIdx] = useState(0)
  if (songs.length === 0) return <p style={{ textAlign: 'center', padding: 60, color: 'var(--color-muted)', fontSize: 13 }}>No songs in this playlist.</p>
  return (
    <div>
      <div className="flex items-center justify-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="disabled:opacity-30" style={{ color: 'var(--color-muted)' }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{playlistName} · {idx + 1} / {songs.length}</span>
        <button onClick={() => setIdx((i) => Math.min(songs.length - 1, i + 1))} disabled={idx === songs.length - 1} className="disabled:opacity-30" style={{ color: 'var(--color-muted)' }}>
          <ChevronRight size={16} />
        </button>
      </div>
      <PracticeClient song={songs[idx]} />
    </div>
  )
}
