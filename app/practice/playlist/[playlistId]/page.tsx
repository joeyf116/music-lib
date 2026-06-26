export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { playlists } from '@/lib/db/schema'
import PlaylistPracticeClient from '@/components/practice/PlaylistPracticeClient'

export default async function PracticePlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params
  const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, playlistId) })
  if (!playlist) notFound()

  const songIds = playlist.songIds as string[]
  const songData = songIds.length > 0
    ? await db.query.songs.findMany()
    : []

  const ordered = songIds.map((id) => songData.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => s != null)
  return <PlaylistPracticeClient songs={ordered} playlistName={playlist.name} />
}
