import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { ArrowLeft, Edit2, Play, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'
import { playlists } from '@/lib/db/schema'
import DeletePlaylistButton from '@/components/playlists/DeletePlaylistButton'

export default async function PlaylistDetailPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params
  const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, playlistId) })
  if (!playlist) notFound()

  const songIdList = playlist.songIds as string[]
  const songsData = songIdList.length > 0
    ? await db.query.songs.findMany({ columns: { id: true, title: true, artist: true, key: true } })
    : []
  const songMap = new Map(songsData.map((s) => [s.id, s]))
  const orderedSongs = songIdList.map((id) => songMap.get(id)).filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <Link href="/playlists" className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
          <ArrowLeft size={13} /> Playlists
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/playlists/${playlist.id}/edit`} className="btn-ghost"><Edit2 size={12} /> Edit</Link>
          <DeletePlaylistButton id={playlist.id} name={playlist.name} />
        </div>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4, letterSpacing: '-0.3px' }}>
        {playlist.name}
      </h1>
      {playlist.description && <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 4 }}>{playlist.description}</p>}
      {playlist.practiceGoal && <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 16 }}>Goal: {playlist.practiceGoal}</p>}

      {orderedSongs.length > 0 && (
        <Link href={`/practice/playlist/${playlist.id}`} className="btn-primary mb-6 inline-flex">
          <Play size={12} /> Practice Playlist
        </Link>
      )}

      <p className="section-label mb-3">Songs ({orderedSongs.length})</p>

      {orderedSongs.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
          No songs yet.{' '}
          <Link href={`/playlists/${playlist.id}/edit`} style={{ color: 'var(--color-accent)' }}>Add songs →</Link>
        </p>
      )}

      {orderedSongs.length > 0 && (
        <div className="card overflow-hidden">
          {orderedSongs.map((song, i) => song && (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="flex items-center gap-3 px-4 py-3.5 card-hover"
              style={{ borderBottom: i < orderedSongs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-muted)', width: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{song.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }} className="truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {song.key && <span className="chip">{song.key}</span>}
                <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
