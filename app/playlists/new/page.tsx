export const dynamic = 'force-dynamic'
import PlaylistForm from '@/components/playlists/PlaylistForm'
import { findSongSummaries } from '@/lib/songs/repository'

export default async function NewPlaylistPage() {
  const songs = await findSongSummaries()
  return <PlaylistForm songs={songs} />
}
