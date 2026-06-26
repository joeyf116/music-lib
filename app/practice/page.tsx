import Link from 'next/link'

export default function PracticePage() {
  return (
    <div className="max-w-sm mx-auto px-5 py-16 text-center">
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Practice Mode</h1>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 24 }}>Open a song or playlist to start practicing.</p>
      <div className="flex flex-col gap-2">
        <Link href="/songs" className="btn-primary justify-center py-3" style={{ fontSize: 14 }}>Browse Songs</Link>
        <Link href="/playlists" className="btn-ghost justify-center py-3" style={{ fontSize: 14 }}>Browse Playlists</Link>
      </div>
    </div>
  )
}
