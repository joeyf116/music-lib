import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Music, Search, ChevronRight } from 'lucide-react'
import { getSongs } from '../lib/storage/index.ts'
import type { PracticeStatus } from '../types.ts'

const STATUS_LABELS: Record<PracticeStatus, string> = {
  wantToLearn: 'Want to learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance ready',
}

export default function SongsPage() {
  const songs = getSongs()
  const [query, setQuery] = useState('')

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="page-title">Songs</h1>
        <Link to="/songs/new" className="btn-primary">
          <Plus size={13} /> Add Song
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
        <input
          type="search"
          placeholder="Search by title or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-8"
        />
      </div>

      {songs.length === 0 && (
        <div className="card p-10 text-center">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <Music size={20} style={{ color: 'var(--color-muted)' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>No songs yet</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
            Add your first song to start building your practice library.
          </p>
          <Link to="/songs/new" className="btn-primary">
            <Plus size={13} /> Add Song
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="card overflow-hidden">
          {filtered.map((song, i) => (
            <Link
              key={song.id}
              to={`/songs/${song.id}`}
              className="flex items-center gap-3 px-4 py-3.5 card-hover"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{song.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }} className="truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {song.key && <span className="chip">{song.key}</span>}
                <span
                  className="chip"
                  style={{ fontSize: 10 }}
                >
                  {STATUS_LABELS[song.practiceStatus]}
                </span>
                <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {songs.length > 0 && filtered.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center', padding: '32px 0' }}>
          No songs match "{query}"
        </p>
      )}
    </div>
  )
}
