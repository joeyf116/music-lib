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
  wantToLearn: 'Want to Learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance Ready',
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p style={{ color: 'var(--color-muted)' }}>Song not found.</p>
        <Link to="/songs" className="text-sm mt-2 inline-block" style={{ color: 'var(--color-accent)' }}>← Back to Songs</Link>
      </div>
    )
  }

  function handleDelete() {
    if (!confirm(`Delete "${song!.title}"?`)) return
    deleteSong(song!.id)
    navigate('/songs')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/songs')} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
          <ArrowLeft size={16} /> Songs
        </button>
        <div className="flex items-center gap-2">
          <Link
            to={`/songs/${song.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <Edit2 size={14} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
            style={{ color: '#ef4444', borderColor: '#ef444433', backgroundColor: 'var(--color-surface)' }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{song.title}</h1>
      <p className="text-lg mb-4" style={{ color: 'var(--color-muted)' }}>{song.artist}</p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {song.key && (
          <span className="px-3 py-1 rounded-full text-sm border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
            Key: {song.key}
          </span>
        )}
        {song.capo && (
          <span className="px-3 py-1 rounded-full text-sm border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
            Capo {song.capo}
          </span>
        )}
        {song.tuning && song.tuning !== 'Standard' && (
          <span className="px-3 py-1 rounded-full text-sm border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
            {song.tuning}
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#f9731622', color: '#f97316' }}>
          {STATUS_LABELS[song.practiceStatus]}
        </span>
      </div>

      {/* External links */}
      <div className="flex flex-wrap gap-2 mb-8">
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1DB954', color: '#fff' }}>
            <ExternalLink size={14} /> Spotify
          </a>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <ExternalLink size={14} /> Tab
          </a>
        )}
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#FF0000', color: '#fff' }}>
            <ExternalLink size={14} /> YouTube
          </a>
        )}
        {song.chordProgression.length > 0 && (
          <Link
            to={`/practice/song/${song.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}>
            <Play size={14} /> Practice Mode
          </Link>
        )}
      </div>

      {/* Chord progression */}
      {song.chordProgression.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-muted)' }}>
            Chord Progression
          </h2>
          <div className="flex flex-wrap gap-2 mb-6 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            {song.chordProgression.map((chord, i) => (
              <span key={i} className="px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
                {chord}
              </span>
            ))}
          </div>

          {loading && <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Loading voicings…</p>}

          {!loading && song.chordProgression.map((chord) => {
            const voicings = chordVoicings[chord] ?? []
            return (
              <div key={chord} className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>{chord}</h3>
                {voicings.length === 0 ? (
                  <div className="rounded-lg border p-4 text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                    <Music size={16} className="inline mr-2" />
                    No voicing found for {chord}.{' '}
                    <Link to="/chords" style={{ color: 'var(--color-accent)' }}>Browse chords →</Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {voicings.slice(0, 4).map((v) => (
                      <div key={v.id} className="rounded-xl border p-3" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>{v.position ?? v.name}</p>
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
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>Notes</h2>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>{song.notes}</p>
        </section>
      )}

      {/* Tags */}
      {song.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {song.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs border" style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
