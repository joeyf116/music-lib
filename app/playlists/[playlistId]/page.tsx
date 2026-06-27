export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Play, ChevronRight } from 'lucide-react'
import DeletePlaylistButton from '@/components/playlists/DeletePlaylistButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { findPlaylistWithOrderedSongs } from '@/lib/playlists/repository'

export default async function PlaylistDetailPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params
  const result = await findPlaylistWithOrderedSongs(playlistId)
  if (!result) notFound()

  const { playlist, songs: orderedSongs } = result

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <Link href="/playlists" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Playlists
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/playlists/${playlist.id}/edit`} />}>
            <Edit2 data-icon="inline-start" /> Edit
          </Button>
          <DeletePlaylistButton id={playlist.id} name={playlist.name} />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{playlist.name}</h1>
      {playlist.description && <p className="text-sm text-muted-foreground mb-1">{playlist.description}</p>}
      {playlist.practiceGoal && <p className="text-xs text-muted-foreground mb-4">Goal: {playlist.practiceGoal}</p>}

      {orderedSongs.length > 0 && (
        <Button className="mb-6" nativeButton={false} render={<Link href={`/practice/playlist/${playlist.id}`} />}>
          <Play data-icon="inline-start" /> Practice Playlist
        </Button>
      )}

      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Songs ({orderedSongs.length})
      </p>

      {orderedSongs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No songs yet.{' '}
          <Link href={`/playlists/${playlist.id}/edit`} className="text-primary hover:text-primary/80">Add songs →</Link>
        </p>
      )}

      {orderedSongs.length > 0 && (
        <Card className="overflow-hidden">
          {orderedSongs.map((song, i) => (
            <div key={song.id}>
              <Link href={`/songs/${song.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors">
                <span className="text-xs text-muted-foreground w-5 text-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {song.key && <Badge variant="secondary">{song.key}</Badge>}
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </div>
              </Link>
              {i < orderedSongs.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
