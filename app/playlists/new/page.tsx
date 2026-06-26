export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import PlaylistForm from '@/components/playlists/PlaylistForm'

export default async function NewPlaylistPage() {
  const songs = await db.query.songs.findMany({ columns: { id: true, title: true, artist: true } })
  return <PlaylistForm songs={songs} />
}
