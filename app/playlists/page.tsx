export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Plus, ListMusic, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { findAllPlaylists } from '@/lib/playlists/repository'
import { findAllSongIds } from '@/lib/songs/repository'

export default async function PlaylistsPage() {
  const [playlists, songIds] = await Promise.all([findAllPlaylists(), findAllSongIds()])

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold tracking-tight">Playlists</h1>
        <Button size="sm" nativeButton={false} render={<Link href="/playlists/new" />}>
          <Plus data-icon="inline-start" /> New Playlist
        </Button>
      </div>

      {playlists.length === 0 && (
        <Card className="p-10 text-center">
          <div className="size-11 rounded-xl flex items-center justify-center mx-auto mb-3 bg-muted">
            <ListMusic className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold mb-1">No playlists yet</p>
          <p className="text-sm text-muted-foreground mb-4">Group songs into playlists for focused practice sessions.</p>
          <Button size="sm" nativeButton={false} render={<Link href="/playlists/new" />}>
            <Plus data-icon="inline-start" /> New Playlist
          </Button>
        </Card>
      )}

      {playlists.length > 0 && (
        <Card className="overflow-hidden">
          {playlists.map((pl, i) => {
            const count = (pl.songIds as string[]).filter((id) => songIds.has(id)).length
            return (
              <div key={pl.id}>
                <Link href={`/playlists/${pl.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors">
                  <div className="size-8 rounded flex items-center justify-center bg-muted flex-shrink-0">
                    <ListMusic className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pl.name}</p>
                    {pl.description && <p className="text-xs text-muted-foreground truncate">{pl.description}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{count} {count === 1 ? 'song' : 'songs'}</span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </Link>
                {i < playlists.length - 1 && <Separator />}
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}
