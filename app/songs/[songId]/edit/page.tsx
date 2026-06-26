export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import SongForm from '@/components/songs/SongForm'

export default async function EditSongPage({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params
  const song = await db.query.songs.findFirst({ where: eq(songs.id, songId) })
  if (!song) notFound()
  return <SongForm song={song} />
}
