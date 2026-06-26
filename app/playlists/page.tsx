export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Plus, ListMusic, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'

export default async function PlaylistsPage() {
  const [playlists, songs] = await Promise.all([
    db.query.playlists.findMany({ orderBy: (p, { desc }) => [desc(p.createdAt)] }),
    db.query.songs.findMany({ columns: { id: true } }),
  ])
  const songIds = new Set(songs.map((s) => s.id))

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="page-title">Playlists</h1>
        <Link href="/playlists/new" className="btn-primary"><Plus size={13} /> New Playlist</Link>
      </div>

      {playlists.length === 0 && (
        <div className="card p-10 text-center">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <ListMusic size={20} style={{ color: 'var(--color-muted)' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>No playlists yet</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Group songs into playlists for focused practice sessions.</p>
          <Link href="/playlists/new" className="btn-primary"><Plus size={13} /> New Playlist</Link>
        </div>
      )}

      {playlists.length > 0 && (
        <div className="card overflow-hidden">
          {playlists.map((pl, i) => {
            const count = (pl.songIds as string[]).filter((id) => songIds.has(id)).length
            return (
              <Link
                key={pl.id}
                href={`/playlists/${pl.id}`}
                className="flex items-center gap-3 px-4 py-3.5 card-hover"
                style={{ borderBottom: i < playlists.length - 1 ? '1px solid var(--color-border)' : 'none' }}
              >
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                  <ListMusic size={14} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }} className="truncate">{pl.name}</p>
                  {pl.description && <p style={{ fontSize: 12, color: 'var(--color-muted)' }} className="truncate">{pl.description}</p>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-muted)', flexShrink: 0 }}>{count} {count === 1 ? 'song' : 'songs'}</span>
                <ChevronRight size={13} style={{ color: 'var(--color-border-strong)' }} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
