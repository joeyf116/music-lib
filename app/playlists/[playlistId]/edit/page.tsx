export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import PlaylistForm from '@/components/playlists/PlaylistForm'
import { findPlaylistById } from '@/lib/playlists/repository'
import { findSongSummaries } from '@/lib/songs/repository'

export default async function EditPlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params
  const [playlist, songs] = await Promise.all([
    findPlaylistById(playlistId),
    findSongSummaries(),
  ])
  if (!playlist) notFound()
  return <PlaylistForm playlist={playlist} songs={songs} />
}
