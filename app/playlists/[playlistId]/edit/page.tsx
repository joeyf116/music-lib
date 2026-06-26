export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { playlists } from '@/lib/db/schema'
import PlaylistForm from '@/components/playlists/PlaylistForm'

export default async function EditPlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params
  const [playlist, songs] = await Promise.all([
    db.query.playlists.findFirst({ where: eq(playlists.id, playlistId) }),
    db.query.songs.findMany({ columns: { id: true, title: true, artist: true } }),
  ])
  if (!playlist) notFound()
  return <PlaylistForm playlist={playlist} songs={songs} />
}
