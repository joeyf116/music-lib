import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSongs, getPlaylists } from '../lib/storage/index.ts'
import { useChordData } from '../hooks/useChordData.ts'
import { useApp } from '../contexts/AppContext.tsx'
import ChordBox from '../components/diagrams/ChordBox.tsx'
import { findVoicings } from '../lib/music/chords.ts'
import type { Song } from '../types.ts'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function PracticeTimer() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
        {formatTime(elapsed)}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="p-2 rounded-full"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }}
        aria-label={running ? 'Pause' : 'Start'}
      >
        {running ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button
        onClick={() => { setRunning(false); setElapsed(0) }}
        className="p-2 rounded-full"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-muted)' }}
        aria-label="Reset"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  )
}

function SongPracticeView({ song }: { song: Song }) {
  const { entries } = useChordData()
  const { prefs } = useApp()
  const [chordIdx, setChordIdx] = useState(0)

  const chords = song.chordProgression
  const currentChord = chords[chordIdx]

  const voicings = useMemo(
    () => (currentChord ? findVoicings(currentChord, entries) : []),
    [currentChord, entries],
  )

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 min-h-[60vh] justify-center">
      {/* Song info */}
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{song.title}</h1>
        <p className="text-xl mt-1" style={{ color: 'var(--color-muted)' }}>{song.artist}</p>
        {song.key && <p className="text-lg mt-1" style={{ color: 'var(--color-accent)' }}>Key: {song.key}</p>}
      </div>

      {/* Progression navigator */}
      {chords.length > 0 && (
        <div className="w-full max-w-sm">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {chords.map((c, i) => (
              <button
                key={i}
                onClick={() => setChordIdx(i)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: i === chordIdx ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: i === chordIdx ? '#fff' : 'var(--color-text)',
                  borderColor: i === chordIdx ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setChordIdx((i) => Math.max(0, i - 1))}
              disabled={chordIdx === 0}
              className="p-2 rounded-full disabled:opacity-30"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-4xl font-bold" style={{ color: 'var(--color-text)', minWidth: '4rem', textAlign: 'center' }}>
              {currentChord}
            </span>
            <button
              onClick={() => setChordIdx((i) => Math.min(chords.length - 1, i + 1))}
              disabled={chordIdx === chords.length - 1}
              className="p-2 rounded-full disabled:opacity-30"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Chord diagram */}
          {voicings.length > 0 && voicings[0].diagram && (
            <div className="flex justify-center">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0e0a04' }}>
                <ChordBox diagram={voicings[0].diagram} leftHanded={prefs.leftHanded} />
              </div>
            </div>
          )}
          {voicings.length === 0 && currentChord && (
            <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>No diagram for {currentChord}</p>
          )}
        </div>
      )}

      {/* External links */}
      <div className="flex flex-wrap justify-center gap-3">
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1DB954', color: '#fff' }}>
            <ExternalLink size={16} /> Spotify
          </a>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <ExternalLink size={16} /> Tab
          </a>
        )}
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#FF0000', color: '#fff' }}>
            <ExternalLink size={16} /> YouTube
          </a>
        )}
      </div>

      {/* Timer */}
      <PracticeTimer />
    </div>
  )
}

function PlaylistPracticeView({ playlistId }: { playlistId: string }) {
  const playlist = getPlaylists().find((p) => p.id === playlistId)
  const allSongs = getSongs()
  const [songIdx, setSongIdx] = useState(0)

  if (!playlist) return <p style={{ color: 'var(--color-muted)' }}>Playlist not found.</p>

  const songs = playlist.songIds.map((id) => allSongs.find((s) => s.id === id)).filter(Boolean) as Song[]

  if (songs.length === 0) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--color-muted)' }}>No songs in this playlist.</p>
        <Link to={`/playlists/${playlistId}/edit`} style={{ color: 'var(--color-accent)' }}>Add songs →</Link>
      </div>
    )
  }

  const song = songs[songIdx]

  return (
    <div>
      <div className="flex items-center justify-center gap-3 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={() => setSongIdx((i) => Math.max(0, i - 1))} disabled={songIdx === 0} className="p-1 disabled:opacity-30" style={{ color: 'var(--color-muted)' }}>
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {playlist.name} · {songIdx + 1} / {songs.length}
        </span>
        <button onClick={() => setSongIdx((i) => Math.min(songs.length - 1, i + 1))} disabled={songIdx === songs.length - 1} className="p-1 disabled:opacity-30" style={{ color: 'var(--color-muted)' }}>
          <ChevronRight size={20} />
        </button>
      </div>
      <SongPracticeView song={song} />
    </div>
  )
}

export default function PracticePage() {
  const { songId, playlistId } = useParams()
  const navigate = useNavigate()

  const song = songId ? getSongs().find((s) => s.id === songId) : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Practice Mode</span>
        <div style={{ width: 60 }} />
      </div>

      {songId && song && <SongPracticeView song={song} />}
      {songId && !song && (
        <div className="text-center py-16">
          <p style={{ color: 'var(--color-muted)' }}>Song not found.</p>
          <Link to="/songs" style={{ color: 'var(--color-accent)' }}>← Songs</Link>
        </div>
      )}
      {playlistId && <PlaylistPracticeView playlistId={playlistId} />}
      {!songId && !playlistId && (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Practice Mode</h1>
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>Open a song or playlist to start practicing.</p>
          <div className="flex flex-col gap-3">
            <Link to="/songs" className="px-4 py-3 rounded-xl font-medium" style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}>
              Browse Songs
            </Link>
            <Link to="/playlists" className="px-4 py-3 rounded-xl font-medium border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
              Browse Playlists
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
