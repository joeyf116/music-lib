'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSong, updateSong } from '@/app/actions/songs'
import type { Song } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props { song?: Song }

export default function SongForm({ song }: Props) {
  const isEdit = Boolean(song)
  const formRef = useRef<HTMLFormElement>(null)

  const action = isEdit
    ? async (formData: FormData) => { await updateSong(song!.id, formData) }
    : createSong

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <Link
        href={isEdit ? `/songs/${song!.id}` : '/songs'}
        className="flex items-center gap-1.5 mb-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>
      <h1 className="text-xl font-bold tracking-tight mb-6">{isEdit ? 'Edit Song' : 'Add Song'}</h1>

      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required defaultValue={song?.title} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="artist">Artist *</Label>
            <Input id="artist" name="artist" required defaultValue={song?.artist ?? ''} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key">Key</Label>
            <Input id="key" name="key" placeholder="e.g. C#m" defaultValue={song?.key ?? ''} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="capo">Capo</Label>
            <Input id="capo" name="capo" placeholder="e.g. 2" defaultValue={song?.capo ?? ''} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tuning">Tuning</Label>
            <Input id="tuning" name="tuning" placeholder="Standard" defaultValue={song?.tuning ?? ''} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="difficulty">Difficulty</Label>
            <select name="difficulty" id="difficulty" defaultValue={song?.difficulty ?? ''}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              <option value="">—</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instrumentFocus">Instrument</Label>
            <select name="instrumentFocus" id="instrumentFocus" defaultValue={song?.instrumentFocus ?? 'guitar'}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              <option value="guitar">Guitar</option>
              <option value="bass">Bass</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="chordProgression">Chord Progression</Label>
          <Input
            id="chordProgression"
            name="chordProgression"
            placeholder="e.g. G - F#m - C - D"
            defaultValue={song ? (song.chordProgression as string[]).join(' - ') : ''}
          />
          <p className="text-xs text-muted-foreground">Separate chords with spaces or dashes</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="practiceStatus">Practice Status</Label>
          <select name="practiceStatus" id="practiceStatus" defaultValue={song?.practiceStatus ?? 'wantToLearn'}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
            <option value="wantToLearn">Want to Learn</option>
            <option value="learning">Learning</option>
            <option value="comfortable">Comfortable</option>
            <option value="performanceReady">Performance Ready</option>
          </select>
        </div>

        <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">External Links</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="spotifyUrl">Spotify URL</Label>
            <Input id="spotifyUrl" name="spotifyUrl" type="url" placeholder="https://open.spotify.com/…" defaultValue={song?.spotifyUrl ?? ''} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tabUrl">Tab / Notation URL</Label>
            <Input id="tabUrl" name="tabUrl" type="url" placeholder="https://www.ultimate-guitar.com/…" defaultValue={song?.tabUrl ?? ''} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input id="youtubeUrl" name="youtubeUrl" type="url" placeholder="https://youtube.com/…" defaultValue={song?.youtubeUrl ?? ''} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} defaultValue={song?.notes ?? ''} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="e.g. blues, acoustic, fingerpicking"
            defaultValue={song ? (song.tags as string[]).join(', ') : ''}
          />
        </div>

        <Button type="submit" className="mt-1">
          {isEdit ? 'Save Changes' : 'Add Song'}
        </Button>
      </form>
    </div>
  )
}
