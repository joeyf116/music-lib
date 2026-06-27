export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { ArrowLeft, Edit2, ExternalLink, Play } from 'lucide-react'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import ChordDetailSection from '@/components/songs/ChordDetailSection'
import DeleteSongButton from '@/components/songs/DeleteSongButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABELS = {
  wantToLearn: 'Want to learn', learning: 'Learning',
  comfortable: 'Comfortable', performanceReady: 'Performance ready',
} as const

export default async function SongDetailPage({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params
  const song = await db.query.songs.findFirst({ where: eq(songs.id, songId) })
  if (!song) notFound()

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <Link href="/songs" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Songs
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/songs/${song.id}/edit`} />}>
            <Edit2 data-icon="inline-start" /> Edit
          </Button>
          <DeleteSongButton id={song.id} title={song.title} />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-0.5">{song.title}</h1>
      <p className="text-base text-muted-foreground mb-3">{song.artist}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {song.key && <Badge variant="secondary">Key: {song.key}</Badge>}
        {song.capo && <Badge variant="secondary">Capo {song.capo}</Badge>}
        {song.tuning && song.tuning !== 'Standard' && <Badge variant="secondary">{song.tuning}</Badge>}
        {song.difficulty && <Badge variant="secondary">{song.difficulty}</Badge>}
        <Badge className={cn('border', `status-${song.practiceStatus}`)}>
          {STATUS_LABELS[song.practiceStatus as keyof typeof STATUS_LABELS] ?? song.practiceStatus}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
            <Button style={{ backgroundColor: '#1DB954' }}>
              <ExternalLink data-icon="inline-start" /> Spotify
            </Button>
          </a>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink data-icon="inline-start" /> Tab
            </Button>
          </a>
        )}
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer">
            <Button style={{ backgroundColor: '#FF0000' }}>
              <ExternalLink data-icon="inline-start" /> YouTube
            </Button>
          </a>
        )}
        {song.chordProgression.length > 0 && (
          <Button nativeButton={false} render={<Link href={`/practice/song/${song.id}`} />}>
            <Play data-icon="inline-start" /> Practice Mode
          </Button>
        )}
      </div>

      {song.chordProgression.length > 0 && (
        <section className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Chord Progression</p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-5 bg-muted border">
            {song.chordProgression.map((chord, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-card text-sm font-semibold text-foreground">
                {chord}
              </span>
            ))}
          </div>
          <ChordDetailSection chords={song.chordProgression} />
        </section>
      )}

      {song.notes && (
        <section className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{song.notes}</p>
        </section>
      )}

      {(song.tags as string[]).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(song.tags as string[]).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
      )}
    </div>
  )
}
