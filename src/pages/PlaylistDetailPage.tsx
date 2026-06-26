import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Play } from 'lucide-react'
import { getPlaylists, getSongs, deletePlaylist } from '../lib/storage/index.ts'
import type { PracticeStatus } from '../types.ts'

const STATUS_LABELS: Record<PracticeStatus, string> = {
  wantToLearn: 'Want to Learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance Ready',
}

export default function PlaylistDetailPage() {
  const { playlistId } = useParams()
  const navigate = useNavigate()

  const playlist = getPlaylists().find((p) => p.id === playlistId)
  const allSongs = getSongs()

  if (!playlist) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p style={{ color: 'var(--color-muted)' }}>Playlist not found.</p>
        <Link to="/playlists" className="text-sm mt-2 inline-block" style={{ color: 'var(--color-accent)' }}>← Playlists</Link>
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/playlists')} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
          <ArrowLeft size={16} /> Playlists
        </button>
        <div className="flex items-center gap-2">
          <Link to={`/playlists/${playlist.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <Edit2 size={14} /> Edit
          </Link>
          <button onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
            style={{ color: '#ef4444', borderColor: '#ef444433', backgroundColor: 'var(--color-surface)' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{playlist.name}</h1>
      {playlist.description && <p className="mt-1 mb-2" style={{ color: 'var(--color-muted)' }}>{playlist.description}</p>}
      {playlist.practiceGoal && (
        <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Goal: {playlist.practiceGoal}</p>
      )}

      {songs.length > 0 && (
        <Link
          to={`/practice/playlist/${playlist.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-6"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
        >
          <Play size={14} /> Practice Playlist
        </Link>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
        Songs ({songs.length})
      </h2>

      {songs.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No songs in this playlist yet. <Link to={`/playlists/${playlist.id}/edit`} style={{ color: 'var(--color-accent)' }}>Add songs →</Link></p>
      )}

      <div className="flex flex-col gap-2">
        {songs.map((song, i) => song && (
          <Link
            key={song.id}
            to={`/songs/${song.id}`}
            className="flex items-center gap-4 rounded-xl border p-4 hover:border-orange-500 transition-colors"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <span className="text-lg font-mono w-6 text-center flex-shrink-0" style={{ color: 'var(--color-muted)' }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>{song.title}</p>
              <p className="text-sm truncate" style={{ color: 'var(--color-muted)' }}>{song.artist}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {song.key && <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{song.key}</span>}
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{STATUS_LABELS[song.practiceStatus]}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
