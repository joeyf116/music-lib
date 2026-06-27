'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLibrary } from '@/contexts/LibraryContext'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import type { Song } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

function Timer() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (running) ref.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    else if (ref.current) clearInterval(ref.current)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running])
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono-tab tabular-nums text-3xl font-bold text-foreground min-w-[72px] tracking-tight">
        {formatTime(elapsed)}
      </span>
      <Button
        size="icon"
        variant={running ? 'default' : 'secondary'}
        className="rounded-full"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 rounded-full"
        onClick={() => { setRunning(false); setElapsed(0) }}
      >
        <RotateCcw className="size-3" />
      </Button>
    </div>
  )
}

interface Props { song: Song }

export default function PracticeClient({ song }: Props) {
  const router = useRouter()
  const { search: lookup } = useLibrary()
  const { prefs } = useApp()
  const [chordIdx, setChordIdx] = useState(0)
  const chords = song.chordProgression as string[]
  const currentChord = chords[chordIdx]
  const voicings = useMemo(() => (currentChord ? lookup(currentChord) : []), [currentChord, lookup])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Practice Mode</span>
        <div className="w-[60px]" />
      </div>

      <div className="flex flex-col items-center gap-8 py-10 px-5 min-h-[60vh] justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">{song.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{song.artist}</p>
          {song.key && <p className="text-sm font-semibold text-primary mt-1.5">Key of {song.key}</p>}
        </div>

        {chords.length > 0 && (
          <div className="w-full max-w-sm">
            <ToggleGroup
              value={[String(chordIdx)]}
              onValueChange={(vals) => { if (vals.length > 0) setChordIdx(Number(vals[0])) }}
              className="flex flex-wrap justify-center gap-1.5 mb-6"
            >
              {chords.map((c, i) => (
                <ToggleGroupItem
                  key={i}
                  value={String(i)}
                  className="rounded-full px-3.5 py-1 text-xs font-medium"
                >
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex items-center justify-center gap-5 mb-6">
              <Button
                size="icon"
                variant="secondary"
                className="size-9 rounded-full"
                onClick={() => setChordIdx((i) => Math.max(0, i - 1))}
                disabled={chordIdx === 0}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-5xl font-extrabold text-foreground min-w-[80px] text-center tracking-tight">
                {currentChord}
              </span>
              <Button
                size="icon"
                variant="secondary"
                className="size-9 rounded-full"
                onClick={() => setChordIdx((i) => Math.min(chords.length - 1, i + 1))}
                disabled={chordIdx === chords.length - 1}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {voicings[0]?.diagram ? (
              <div className="flex justify-center">
                <div className="rounded-xl p-4 bg-card border">
                  <ChordBox diagram={voicings[0].diagram} leftHanded={prefs.leftHanded} />
                </div>
              </div>
            ) : currentChord ? (
              <p className="text-sm text-muted-foreground text-center">No diagram for {currentChord}</p>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {song.spotifyUrl && (
            <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
              <Button style={{ backgroundColor: '#1DB954' }}>
                <ExternalLink data-icon="inline-start" /> Spotify
              </Button>
            </a>
          )}
          {song.tabUrl && (
            <a href={song.tabUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink data-icon="inline-start" /> Tab
              </Button>
            </a>
          )}
          {song.youtubeUrl && (
            <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer">
              <Button style={{ backgroundColor: '#FF0000' }}>
                <ExternalLink data-icon="inline-start" /> YouTube
              </Button>
            </a>
          )}
        </div>

        <Timer />
      </div>
    </div>
  )
}
