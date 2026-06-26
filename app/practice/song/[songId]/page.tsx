import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import PracticeClient from '@/components/practice/PracticeClient'

export default async function PracticeSongPage({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params
  const song = await db.query.songs.findFirst({ where: eq(songs.id, songId) })
  if (!song) notFound()
  return <PracticeClient song={song} />
}
