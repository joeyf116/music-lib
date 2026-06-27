export const dynamic = 'force-dynamic'
import HomeClient from '@/components/home/HomeClient'
import { findAllSongs } from '@/lib/songs/repository'
import { findAllPlaylists } from '@/lib/playlists/repository'

export default async function HomePage() {
  const [songs, playlists] = await Promise.all([findAllSongs(), findAllPlaylists()])
  return <HomeClient songs={songs} playlists={playlists} />
}
