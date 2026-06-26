'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useChordLibrary } from '@/hooks/useChordLibrary'
import { useApp } from '@/contexts/AppContext'
import ChordBox from '@/components/diagrams/ChordBox'
import type { Song } from '@/lib/db/schema'

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
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 28, fontWeight: 700, color: 'var(--color-text)', minWidth: 72, letterSpacing: '-0.5px' }}>
        {formatTime(elapsed)}
      </span>
      <button onClick={() => setRunning((r) => !r)}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: running ? 'var(--color-accent)' : 'var(--color-surface-2)', color: running ? '#fff' : 'var(--color-text)' }}>
        {running ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <button onClick={() => { setRunning(false); setElapsed(0) }}
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ color: 'var(--color-muted)' }}>
        <RotateCcw size={13} />
      </button>
    </div>
  )
}

interface Props { song: Song }

export default function PracticeClient({ song }: Props) {
  const router = useRouter()
  const { lookup } = useChordLibrary()
  const { prefs } = useApp()
  const [chordIdx, setChordIdx] = useState(0)
  const chords = song.chordProgression as string[]
  const currentChord = chords[chordIdx]
  const voicings = useMemo(() => (currentChord ? lookup(currentChord) : []), [currentChord, lookup])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={() => router.back()} className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
          <ArrowLeft size={13} /> Back
        </button>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Practice Mode
        </span>
        <div style={{ width: 60 }} />
      </div>

      <div className="flex flex-col items-center gap-8 py-10 px-5 min-h-[60vh] justify-center">
        <div className="text-center">
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{song.title}</h1>
          <p style={{ fontSize: 17, color: 'var(--color-text-dim)', marginTop: 4 }}>{song.artist}</p>
          {song.key && <p style={{ fontSize: 14, color: 'var(--color-accent)', marginTop: 6, fontWeight: 600 }}>Key of {song.key}</p>}
        </div>

        {chords.length > 0 && (
          <div className="w-full max-w-sm">
            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {chords.map((c, i) => (
                <button key={i} onClick={() => setChordIdx(i)} className="pill"
                  style={i === chordIdx ? { backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)', color: '#fff' } : {}}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-5 mb-6">
              <button onClick={() => setChordIdx((i) => Math.max(0, i - 1))} disabled={chordIdx === 0}
                className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-25"
                style={{ backgroundColor: 'var(--color-surface-2)' }}>
                <ChevronLeft size={18} style={{ color: 'var(--color-text)' }} />
              </button>
              <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--color-text)', minWidth: 80, textAlign: 'center', letterSpacing: '-1px' }}>
                {currentChord}
              </span>
              <button onClick={() => setChordIdx((i) => Math.min(chords.length - 1, i + 1))} disabled={chordIdx === chords.length - 1}
                className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-25"
                style={{ backgroundColor: 'var(--color-surface-2)' }}>
                <ChevronRight size={18} style={{ color: 'var(--color-text)' }} />
              </button>
            </div>
            {voicings[0]?.diagram ? (
              <div className="flex justify-center">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#0d0d0d', border: '1px solid var(--color-border)' }}>
                  <ChordBox diagram={voicings[0].diagram} leftHanded={prefs.leftHanded} />
                </div>
              </div>
            ) : currentChord ? (
              <p style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center' }}>No diagram for {currentChord}</p>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {song.spotifyUrl && (
            <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ backgroundColor: '#1DB954', padding: '10px 20px' }}>
              <ExternalLink size={13} /> Spotify
            </a>
          )}
          {song.tabUrl && (
            <a href={song.tabUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '10px 20px' }}>
              <ExternalLink size={13} /> Tab
            </a>
          )}
          {song.youtubeUrl && (
            <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ backgroundColor: '#FF0000', padding: '10px 20px' }}>
              <ExternalLink size={13} /> YouTube
            </a>
          )}
        </div>
        <Timer />
      </div>
    </div>
  )
}
