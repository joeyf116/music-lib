import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, ExternalLink, Play, Music } from 'lucide-react'
import { getSongs, deleteSong } from '../lib/storage/index.ts'
import { useChordData } from '../hooks/useChordData.ts'
import { useApp } from '../contexts/AppContext.tsx'
import ChordBox from '../components/diagrams/ChordBox.tsx'
import { findVoicings } from '../lib/music/chords.ts'
import type { PracticeStatus } from '../types.ts'

const STATUS_LABELS: Record<PracticeStatus, string> = {
  wantToLearn: 'Want to learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance ready',
}

export default function SongDetailPage() {
  const { songId } = useParams()
  const navigate = useNavigate()
  const { entries, loading } = useChordData()
  const { prefs } = useApp()

  const song = getSongs().find((s) => s.id === songId)

  const chordVoicings = useMemo(() => {
    if (!song) return {}
    return Object.fromEntries(
      song.chordProgression.map((chord) => [chord, findVoicings(chord, entries)])
    )
  }, [song, entries])

  if (!song) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p style={{ color: 'var(--color-muted)', fontSize: 13 }}>Song not found.</p>
        <Link to="/songs" style={{ color: 'var(--color-accent)', fontSize: 13 }}>← Back to Songs</Link>
      </div>
    )
  }

  function handleDelete() {
    if (!confirm(`Delete "${song!.title}"?`)) return
    deleteSong(song!.id)
    navigate('/songs')
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate('/songs')}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--color-muted)', fontSize: 13 }}
        >
          <ArrowLeft size={13} /> Songs
        </button>
        <div className="flex items-center gap-2">
          <Link to={`/songs/${song.id}/edit`} className="btn-ghost">
            <Edit2 size={12} /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      {/* Title block */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2, letterSpacing: '-0.3px' }}>
        {song.title}
      </h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-dim)', marginBottom: 12 }}>{song.artist}</p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {song.key && <span className="chip">Key: {song.key}</span>}
        {song.capo && <span className="chip">Capo {song.capo}</span>}
        {song.tuning && song.tuning !== 'Standard' && <span className="chip">{song.tuning}</span>}
        {song.difficulty && <span className="chip">{song.difficulty}</span>}
        <span className={`chip status-${song.practiceStatus}`}>{STATUS_LABELS[song.practiceStatus]}</span>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap gap-2 mb-7">
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ backgroundColor: '#1DB954' }}>
            <ExternalLink size={12} /> Spotify
          </a>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <ExternalLink size={12} /> Tab
          </a>
        )}
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ backgroundColor: '#FF0000' }}>
            <ExternalLink size={12} /> YouTube
          </a>
        )}
        {song.chordProgression.length > 0 && (
          <Link to={`/practice/song/${song.id}`} className="btn-primary">
            <Play size={12} /> Practice Mode
          </Link>
        )}
      </div>

      {/* Chord progression */}
      {song.chordProgression.length > 0 && (
        <section className="mb-7">
          <p className="section-label mb-3">Chord Progression</p>

          {/* Progression strip */}
          <div
            className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-5"
            style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            {song.chordProgression.map((chord, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded"
                style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}
              >
                {chord}
              </span>
            ))}
          </div>

          {loading && <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>Loading voicings…</p>}

          {!loading && song.chordProgression.map((chord) => {
            const voicings = chordVoicings[chord] ?? []
            return (
              <div key={chord} className="mb-5">
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>{chord}</p>
                {voicings.length === 0 ? (
                  <div
                    className="rounded-lg p-3 flex items-center gap-2"
                    style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <Music size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                      No voicing for {chord}.{' '}
                      <Link to="/chords" style={{ color: 'var(--color-accent)' }}>Browse chords →</Link>
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
        </section>
      )}

      {/* Notes */}
      {song.notes && (
        <section className="mb-5">
          <p className="section-label mb-2">Notes</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-dim)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{song.notes}</p>
        </section>
      )}

      {/* Tags */}
      {song.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {song.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      )}
    </div>
  )
}
