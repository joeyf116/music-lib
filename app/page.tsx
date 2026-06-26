export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import HomeClient from '@/components/home/HomeClient'

export default async function HomePage() {
  const [songs, playlists] = await Promise.all([
    db.query.songs.findMany({ orderBy: (s, { desc }) => [desc(s.createdAt)] }),
    db.query.playlists.findMany(),
  ])

  return <HomeClient songs={songs} playlists={playlists} />
}
