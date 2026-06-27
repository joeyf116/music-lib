'use client'

import Link from 'next/link'
import { Music2, BookOpen, ListMusic, Play, Clock, ChevronRight } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import type { Song, Playlist } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
        <h1 className="text-xl font-bold tracking-tight">Practice Atlas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your guitar &amp; bass practice reference</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-7">
        {[
          { to: '/chords', icon: Music2, label: 'Find Chord', sub: 'Browse voicings' },
          { to: '/songs/new', icon: BookOpen, label: 'Add Song', sub: 'Save to library' },
          { to: '/songs', icon: ListMusic, label: 'Song Library', sub: `${songs.length} songs` },
          { to: '/practice', icon: Play, label: 'Practice Mode', sub: 'Full-screen view' },
        ].map(({ to, icon: Icon, label, sub }) => (
          <Link key={to} href={to}>
            <Card className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors cursor-pointer">
              <div className="size-8 rounded flex items-center justify-center bg-primary/10 flex-shrink-0">
                <Icon className="size-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </Card>
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
            <Card key={label} className="px-4 py-3 text-center">
              <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </Card>
          ))}
        </div>
      )}

      {recentSongs.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Songs</span>
            <Link href="/songs" className="text-xs text-primary hover:text-primary/80">View all</Link>
          </div>
          <Card className="overflow-hidden">
            {recentSongs.map((song, i) => (
              <div key={song.id}>
                <Link href={`/songs/${song.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {song.key && <Badge variant="secondary">{song.key}</Badge>}
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </div>
                </Link>
                {i < recentSongs.length - 1 && <Separator />}
              </div>
            ))}
          </Card>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="size-3 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recently Viewed Chords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentlyViewed.slice(0, 8).map((entry) => (
              <Link key={entry.id} href="/chords">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors text-xs px-3 py-1">
                  {entry.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {songs.length === 0 && recentlyViewed.length === 0 && (
        <Card className="p-8 text-center">
          <div className="size-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-primary/10">
            <Music2 className="size-5 text-primary" />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Welcome to Practice Atlas</p>
          <p className="text-sm text-muted-foreground mb-5">Add a song or browse chord voicings to get started.</p>
          <div className="flex justify-center gap-2">
            <Button nativeButton={false} render={<Link href="/songs/new" />}>Add Song</Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/chords" />}>Browse Chords</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
