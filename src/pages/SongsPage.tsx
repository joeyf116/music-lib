import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Music, Search } from 'lucide-react'
import { getSongs } from '../lib/storage/index.ts'
import type { PracticeStatus } from '../types.ts'

const STATUS_LABELS: Record<PracticeStatus, string> = {
  wantToLearn: 'Want to Learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance Ready',
}

const STATUS_COLORS: Record<PracticeStatus, string> = {
  wantToLearn: '#6b7280',
  learning: '#3b82f6',
  comfortable: '#10b981',
  performanceReady: '#f97316',
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Songs</h1>
        <Link
          to="/songs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
        >
          <Plus size={16} />
          Add Song
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
        <input
          type="search"
          placeholder="Search songs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {songs.length === 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <Music size={40} className="mx-auto mb-3" style={{ color: 'var(--color-muted)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>No songs yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Add your first song to start building your practice library.</p>
          <Link
            to="/songs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            <Plus size={16} /> Add Song
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((song) => (
          <Link
            key={song.id}
            to={`/songs/${song.id}`}
            className="flex items-center gap-4 rounded-xl border p-4 hover:border-orange-500 transition-colors"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>{song.title}</p>
              <p className="text-sm truncate" style={{ color: 'var(--color-muted)' }}>{song.artist}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {song.key && (
                <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
                  {song.key}
                </span>
              )}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: STATUS_COLORS[song.practiceStatus] + '22', color: STATUS_COLORS[song.practiceStatus] }}
              >
                {STATUS_LABELS[song.practiceStatus]}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {songs.length > 0 && filtered.length === 0 && (
        <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>No songs match "{query}"</p>
      )}
    </div>
  )
}
