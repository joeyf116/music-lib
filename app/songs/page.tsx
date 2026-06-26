export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Plus, Music, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'

const STATUS_LABELS = {
  wantToLearn: 'Want to learn', learning: 'Learning',
  comfortable: 'Comfortable', performanceReady: 'Performance ready',
} as const

export default async function SongsPage() {
  const songs = await db.query.songs.findMany({ orderBy: (s, { desc }) => [desc(s.createdAt)] })

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="page-title">Songs</h1>
        <Link href="/songs/new" className="btn-primary"><Plus size={13} /> Add Song</Link>
      </div>

      {songs.length === 0 && (
        <div className="card p-10 text-center">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <Music size={20} style={{ color: 'var(--color-muted)' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>No songs yet</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Add your first song to start building your practice library.</p>
          <Link href="/songs/new" className="btn-primary"><Plus size={13} /> Add Song</Link>
        </div>
      )}

      {songs.length > 0 && (
        <div className="card overflow-hidden">
          {songs.map((song, i) => (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="flex items-center gap-3 px-4 py-3.5 card-hover"
              style={{ borderBottom: i < songs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{song.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }} className="truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {song.key && <span className="chip">{song.key}</span>}
                <span className="chip" style={{ fontSize: 10 }}>
                  {STATUS_LABELS[song.practiceStatus as keyof typeof STATUS_LABELS] ?? song.practiceStatus}
                </span>
                <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
