import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PracticePage() {
  return (
    <div className="max-w-sm mx-auto px-5 py-16 text-center">
      <h1 className="text-xl font-bold tracking-tight mb-2">Practice Mode</h1>
      <p className="text-sm text-muted-foreground mb-6">Open a song or playlist to start practicing.</p>
      <div className="flex flex-col gap-2">
        <Button className="justify-center" nativeButton={false} render={<Link href="/songs" />}>Browse Songs</Button>
        <Button variant="outline" className="justify-center" nativeButton={false} render={<Link href="/playlists" />}>Browse Playlists</Button>
      </div>
    </div>
  )
}
