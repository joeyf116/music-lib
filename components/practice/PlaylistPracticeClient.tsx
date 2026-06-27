'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PracticeClient from './PracticeClient'
import type { Song } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Props { songs: Song[]; playlistName: string }

export default function PlaylistPracticeClient({ songs, playlistName }: Props) {
  const [idx, setIdx] = useState(0)
  if (songs.length === 0) {
    return <p className="text-center py-16 text-sm text-muted-foreground">No songs in this playlist.</p>
  }
  return (
    <div>
      <div className="flex items-center justify-center gap-3 py-2.5 border-b">
        <Button size="icon" variant="ghost" className="size-7" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs text-muted-foreground">{playlistName} · {idx + 1} / {songs.length}</span>
        <Button size="icon" variant="ghost" className="size-7" onClick={() => setIdx((i) => Math.min(songs.length - 1, i + 1))} disabled={idx === songs.length - 1}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <PracticeClient song={songs[idx]} />
    </div>
  )
}
