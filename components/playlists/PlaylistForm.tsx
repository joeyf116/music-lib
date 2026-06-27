'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPlaylist, updatePlaylist } from '@/app/actions/playlists'
import type { Playlist } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface SongStub { id: string; title: string; artist: string }
interface Props { playlist?: Playlist; songs: SongStub[] }

export default function PlaylistForm({ playlist, songs }: Props) {
  const isEdit = Boolean(playlist)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    playlist ? (playlist.songIds as string[]) : []
  )

  const action = isEdit
    ? async (formData: FormData) => {
        selectedIds.forEach((id) => formData.append('songIds', id))
        await updatePlaylist(playlist!.id, formData)
      }
    : async (formData: FormData) => {
        selectedIds.forEach((id) => formData.append('songIds', id))
        await createPlaylist(formData)
      }

  function toggleSong(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <Link
        href={isEdit ? `/playlists/${playlist!.id}` : '/playlists'}
        className="flex items-center gap-1.5 mb-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>
      <h1 className="text-xl font-bold tracking-tight mb-6">{isEdit ? 'Edit Playlist' : 'New Playlist'}</h1>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required defaultValue={playlist?.name} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" defaultValue={playlist?.description ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="practiceGoal">Practice Goal</Label>
          <Input id="practiceGoal" name="practiceGoal" placeholder="e.g. Learn 5 fingerpicking songs" defaultValue={playlist?.practiceGoal ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" placeholder="e.g. acoustic, blues" defaultValue={playlist ? (playlist.tags as string[]).join(', ') : ''} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Songs ({selectedIds.length} selected)
          </p>
          {songs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No songs yet. Add songs first.</p>
          ) : (
            <div className="rounded-lg border bg-card overflow-hidden">
              <ScrollArea className="max-h-64">
                {songs.map((song, i) => (
                  <div key={song.id}>
                    <button
                      type="button"
                      onClick={() => toggleSong(song.id)}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={selectedIds.includes(song.id)}
                        onCheckedChange={() => toggleSong(song.id)}
                        aria-label={`Select ${song.title}`}
                      />
                      <span className="text-sm font-medium text-foreground flex-1 truncate">{song.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{song.artist}</span>
                    </button>
                    {i < songs.length - 1 && <Separator />}
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>

        <Button type="submit" className="mt-1">
          {isEdit ? 'Save Changes' : 'Create Playlist'}
        </Button>
      </form>
    </div>
  )
}
