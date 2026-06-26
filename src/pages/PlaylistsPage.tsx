import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ListMusic } from 'lucide-react'
import { getPlaylists, getSongs } from '../lib/storage/index.ts'

export default function PlaylistsPage() {
  const playlists = getPlaylists()
  const songs = getSongs()
  const [query, setQuery] = useState('')

  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Playlists</h1>
        <Link
          to="/playlists/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
        >
          <Plus size={16} /> New Playlist
        </Link>
      </div>

      {playlists.length > 1 && (
        <input
          type="search"
          placeholder="Search playlists…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border text-sm mb-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        />
      )}

      {playlists.length === 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <ListMusic size={40} className="mx-auto mb-3" style={{ color: 'var(--color-muted)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>No playlists yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Group songs into playlists for focused practice sessions.</p>
          <Link to="/playlists/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}>
            <Plus size={16} /> New Playlist
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((pl) => {
          const plSongs = pl.songIds.map((id) => songs.find((s) => s.id === id)).filter(Boolean)
          return (
            <Link
              key={pl.id}
              to={`/playlists/${pl.id}`}
              className="flex items-center gap-4 rounded-xl border p-4 hover:border-orange-500 transition-colors"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <ListMusic size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>{pl.name}</p>
                {pl.description && <p className="text-sm truncate" style={{ color: 'var(--color-muted)' }}>{pl.description}</p>}
              </div>
              <span className="text-sm flex-shrink-0" style={{ color: 'var(--color-muted)' }}>
                {plSongs.length} {plSongs.length === 1 ? 'song' : 'songs'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
