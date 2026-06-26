import { Link } from 'react-router-dom'
import { Music2, BookOpen, ListMusic, Play, Clock } from 'lucide-react'
import { getSongs, getPlaylists } from '../lib/storage/index.ts'
import { useApp } from '../contexts/AppContext.tsx'

export default function HomePage() {
  const { recentlyViewed } = useApp()
  const songs = getSongs()
  const playlists = getPlaylists()

  const recentSongs = songs.slice(-3).reverse()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Practice Atlas</h1>
        <p className="text-base" style={{ color: 'var(--color-muted)' }}>Your guitar & bass practice reference.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          to="/chords"
          className="flex items-center gap-3 rounded-xl border p-4 hover:border-orange-500 transition-colors"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <Music2 size={22} style={{ color: 'var(--color-accent)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Find Chord</span>
        </Link>
        <Link
          to="/songs/new"
          className="flex items-center gap-3 rounded-xl border p-4 hover:border-orange-500 transition-colors"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <BookOpen size={22} style={{ color: 'var(--color-accent)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Add Song</span>
        </Link>
        <Link
          to="/songs"
          className="flex items-center gap-3 rounded-xl border p-4 hover:border-orange-500 transition-colors"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <ListMusic size={22} style={{ color: 'var(--color-accent)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Song Library</span>
        </Link>
        <Link
          to="/practice"
          className="flex items-center gap-3 rounded-xl border p-4 hover:border-orange-500 transition-colors"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <Play size={22} style={{ color: 'var(--color-accent)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Practice Mode</span>
        </Link>
      </div>

      {/* Stats */}
      {(songs.length > 0 || playlists.length > 0) && (
        <div className="flex gap-4 mb-8">
          <div className="rounded-xl border p-4 flex-1 text-center" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{songs.length}</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Songs</p>
          </div>
          <div className="rounded-xl border p-4 flex-1 text-center" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{playlists.length}</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Playlists</p>
          </div>
          <div className="rounded-xl border p-4 flex-1 text-center" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {songs.filter((s) => s.practiceStatus === 'learning').length}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Learning</p>
          </div>
        </div>
      )}

      {/* Recent songs */}
      {recentSongs.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Recent Songs</h2>
            <Link to="/songs" className="text-xs" style={{ color: 'var(--color-accent)' }}>View all</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentSongs.map((song) => (
              <Link
                key={song.id}
                to={`/songs/${song.id}`}
                className="flex items-center gap-3 rounded-xl border p-3 hover:border-orange-500 transition-colors"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <BookOpen size={16} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>{song.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{song.artist}</p>
                </div>
                {song.key && <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-muted)' }}>{song.key}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed chords */}
      {recentlyViewed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} style={{ color: 'var(--color-muted)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Recently Viewed</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentlyViewed.slice(0, 6).map((entry) => (
              <Link
                key={entry.id}
                to="/chords"
                className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {entry.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {songs.length === 0 && recentlyViewed.length === 0 && (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>Welcome to Practice Atlas</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Start by adding a song or browsing chords.</p>
          <div className="flex justify-center gap-3">
            <Link to="/songs/new" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}>
              Add Song
            </Link>
            <Link to="/chords" className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
              Browse Chords
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
