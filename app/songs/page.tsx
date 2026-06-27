export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Plus, Music, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const STATUS_LABELS = {
  wantToLearn: 'Want to learn', learning: 'Learning',
  comfortable: 'Comfortable', performanceReady: 'Performance ready',
} as const

export default async function SongsPage() {
  const songs = await db.query.songs.findMany({ orderBy: (s, { desc }) => [desc(s.createdAt)] })

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold tracking-tight">Songs</h1>
        <Button size="sm" nativeButton={false} render={<Link href="/songs/new" />}>
          <Plus data-icon="inline-start" /> Add Song
        </Button>
      </div>

      {songs.length === 0 && (
        <Card className="p-10 text-center">
          <div className="size-11 rounded-xl flex items-center justify-center mx-auto mb-3 bg-muted">
            <Music className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold mb-1">No songs yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first song to start building your practice library.</p>
          <Button size="sm" nativeButton={false} render={<Link href="/songs/new" />}>
            <Plus data-icon="inline-start" /> Add Song
          </Button>
        </Card>
      )}

      {songs.length > 0 && (
        <Card className="overflow-hidden">
          {songs.map((song, i) => (
            <div key={song.id}>
              <Link href={`/songs/${song.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {song.key && <Badge variant="secondary">{song.key}</Badge>}
                  <Badge variant="outline" className="text-xs">
                    {STATUS_LABELS[song.practiceStatus as keyof typeof STATUS_LABELS] ?? song.practiceStatus}
                  </Badge>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </div>
              </Link>
              {i < songs.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
