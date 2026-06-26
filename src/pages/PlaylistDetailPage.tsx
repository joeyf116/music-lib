import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Play, ChevronRight } from 'lucide-react'
import { getPlaylists, getSongs, deletePlaylist } from '../lib/storage/index.ts'
import type { PracticeStatus } from '../types.ts'

const STATUS_LABELS: Record<PracticeStatus, string> = {
  wantToLearn: 'Want to learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance ready',
}

export default function PlaylistDetailPage() {
  const { playlistId } = useParams()
  const navigate = useNavigate()

  const playlist = getPlaylists().find((p) => p.id === playlistId)
  const allSongs = getSongs()

  if (!playlist) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Playlist not found.</p>
        <Link to="/playlists" style={{ fontSize: 13, color: 'var(--color-accent)' }}>← Playlists</Link>
      </div>
    )
  }

  const songs = playlist.songIds.map((id) => allSongs.find((s) => s.id === id)).filter(Boolean)

  function handleDelete() {
    if (!confirm(`Delete "${playlist!.name}"?`)) return
    deletePlaylist(playlist!.id)
    navigate('/playlists')
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate('/playlists')} className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
          <ArrowLeft size={13} /> Playlists
        </button>
        <div className="flex items-center gap-2">
          <Link to={`/playlists/${playlist.id}/edit`} className="btn-ghost">
            <Edit2 size={12} /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4, letterSpacing: '-0.3px' }}>
        {playlist.name}
      </h1>
      {playlist.description && (
        <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 4 }}>{playlist.description}</p>
      )}
      {playlist.practiceGoal && (
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 16 }}>Goal: {playlist.practiceGoal}</p>
      )}

      {songs.length > 0 && (
        <Link to={`/practice/playlist/${playlist.id}`} className="btn-primary mb-6 inline-flex">
          <Play size={12} /> Practice Playlist
        </Link>
      )}

      <p className="section-label mb-3">Songs ({songs.length})</p>

      {songs.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
          No songs yet.{' '}
          <Link to={`/playlists/${playlist.id}/edit`} style={{ color: 'var(--color-accent)' }}>Add songs →</Link>
        </p>
      )}

      {songs.length > 0 && (
        <div className="card overflow-hidden">
          {songs.map((song, i) => song && (
            <Link
              key={song.id}
              to={`/songs/${song.id}`}
              className="flex items-center gap-3 px-4 py-3.5 card-hover"
              style={{ borderBottom: i < songs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-muted)', width: 20, textAlign: 'center', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{song.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }} className="truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {song.key && <span className="chip">{song.key}</span>}
                <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
