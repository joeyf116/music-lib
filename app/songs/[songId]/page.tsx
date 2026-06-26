import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { ArrowLeft, Edit2, ExternalLink, Play, Music } from 'lucide-react'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import { findVoicings } from '@/lib/music/chords'
import ChordDetailSection from '@/components/songs/ChordDetailSection'
import DeleteSongButton from '@/components/songs/DeleteSongButton'

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
        <Link href="/songs" className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
          <ArrowLeft size={13} /> Songs
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/songs/${song.id}/edit`} className="btn-ghost"><Edit2 size={12} /> Edit</Link>
          <DeleteSongButton id={song.id} title={song.title} />
        </div>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2, letterSpacing: '-0.3px' }}>
        {song.title}
      </h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-dim)', marginBottom: 12 }}>{song.artist}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {song.key && <span className="chip">Key: {song.key}</span>}
        {song.capo && <span className="chip">Capo {song.capo}</span>}
        {song.tuning && song.tuning !== 'Standard' && <span className="chip">{song.tuning}</span>}
        {song.difficulty && <span className="chip">{song.difficulty}</span>}
        <span className={`chip status-${song.practiceStatus}`}>
          {STATUS_LABELS[song.practiceStatus as keyof typeof STATUS_LABELS] ?? song.practiceStatus}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ backgroundColor: '#1DB954' }}>
            <ExternalLink size={12} /> Spotify
          </a>
        )}
        {song.tabUrl && (
          <a href={song.tabUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <ExternalLink size={12} /> Tab
          </a>
        )}
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ backgroundColor: '#FF0000' }}>
            <ExternalLink size={12} /> YouTube
          </a>
        )}
        {song.chordProgression.length > 0 && (
          <Link href={`/practice/song/${song.id}`} className="btn-primary">
            <Play size={12} /> Practice Mode
          </Link>
        )}
      </div>

      {song.chordProgression.length > 0 && (
        <section className="mb-7">
          <p className="section-label mb-3">Chord Progression</p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-5" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            {song.chordProgression.map((chord, i) => (
              <span key={i} className="px-2.5 py-1 rounded" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}>
                {chord}
              </span>
            ))}
          </div>
          <ChordDetailSection chords={song.chordProgression} />
        </section>
      )}

      {song.notes && (
        <section className="mb-5">
          <p className="section-label mb-2">Notes</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-dim)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{song.notes}</p>
        </section>
      )}

      {(song.tags as string[]).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(song.tags as string[]).map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      )}
    </div>
  )
}
