'use client'

import Link from 'next/link'
import { Music2, BookOpen, ListMusic, Play, Clock, ChevronRight } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import type { Song, Playlist } from '@/lib/db/schema'

const STATUS_LABELS = {
  wantToLearn: 'Want to learn',
  learning: 'Learning',
  comfortable: 'Comfortable',
  performanceReady: 'Performance ready',
} as const

interface Props {
  songs: Song[]
  playlists: Playlist[]
}

export default function HomeClient({ songs, playlists }: Props) {
  const { recentlyViewed } = useApp()
  const recentSongs = songs.slice(0, 4)

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="mb-7">
        <h1 className="page-title mb-0.5">Practice Atlas</h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Your guitar & bass practice reference</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-7">
        {[
          { to: '/chords', icon: Music2, label: 'Find Chord', sub: 'Browse voicings' },
          { to: '/songs/new', icon: BookOpen, label: 'Add Song', sub: 'Save to library' },
          { to: '/songs', icon: ListMusic, label: 'Song Library', sub: `${songs.length} songs` },
          { to: '/practice', icon: Play, label: 'Practice Mode', sub: 'Full-screen view' },
        ].map(({ to, icon: Icon, label, sub }) => (
          <Link key={to} href={to} className="card card-hover flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
              <Icon size={15} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="min-w-0">
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{label}</p>
              <p style={{ fontSize: 11, color: 'var(--color-muted)' }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {(songs.length > 0 || playlists.length > 0) && (
        <div className="grid grid-cols-3 gap-2 mb-7">
          {[
            { value: songs.length, label: 'Songs' },
            { value: playlists.length, label: 'Playlists' },
            { value: songs.filter((s) => s.practiceStatus === 'learning').length, label: 'Learning' },
          ].map(({ value, label }) => (
            <div key={label} className="card px-4 py-3 text-center">
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>{value}</p>
              <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {recentSongs.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Recent Songs</span>
            <Link href="/songs" style={{ fontSize: 11, color: 'var(--color-accent)' }}>View all</Link>
          </div>
          <div className="card overflow-hidden">
            {recentSongs.map((song, i) => (
              <Link
                key={song.id}
                href={`/songs/${song.id}`}
                className="flex items-center gap-3 px-4 py-3 card-hover"
                style={{ borderBottom: i < recentSongs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{song.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-muted)' }} className="truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {song.key && <span className="chip">{song.key}</span>}
                  <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={11} style={{ color: 'var(--color-muted)' }} />
            <span className="section-label">Recently Viewed Chords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentlyViewed.slice(0, 8).map((entry) => (
              <Link key={entry.id} href="/chords" className="chip card-hover" style={{ fontSize: 12, padding: '4px 12px' }}>
                {entry.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {songs.length === 0 && recentlyViewed.length === 0 && (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
            <Music2 size={22} style={{ color: 'var(--color-accent)' }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Welcome to Practice Atlas</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>Add a song or browse chord voicings to get started.</p>
          <div className="flex justify-center gap-2">
            <Link href="/songs/new" className="btn-primary">Add Song</Link>
            <Link href="/chords" className="btn-ghost">Browse Chords</Link>
          </div>
        </div>
      )}
    </div>
  )
}
