'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSong, updateSong } from '@/app/actions/songs'
import type { Song } from '@/lib/db/schema'

interface Props { song?: Song }

export default function SongForm({ song }: Props) {
  const isEdit = Boolean(song)
  const formRef = useRef<HTMLFormElement>(null)

  const action = isEdit
    ? async (formData: FormData) => { await updateSong(song!.id, formData) }
    : createSong

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="section-label block mb-1.5">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <Link href={isEdit ? `/songs/${song!.id}` : '/songs'} className="flex items-center gap-1.5 mb-5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
        <ArrowLeft size={13} /> Back
      </Link>
      <h1 className="page-title mb-6">{isEdit ? 'Edit Song' : 'Add Song'}</h1>

      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title *">
            <input name="title" required className="input" defaultValue={song?.title} />
          </Field>
          <Field label="Artist *">
            <input name="artist" required className="input" defaultValue={song?.artist ?? ''} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Key">
            <input name="key" placeholder="e.g. C#m" className="input" defaultValue={song?.key ?? ''} />
          </Field>
          <Field label="Capo">
            <input name="capo" placeholder="e.g. 2" className="input" defaultValue={song?.capo ?? ''} />
          </Field>
          <Field label="Tuning">
            <input name="tuning" placeholder="Standard" className="input" defaultValue={song?.tuning ?? ''} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Difficulty">
            <select name="difficulty" className="input" defaultValue={song?.difficulty ?? ''}>
              <option value="">—</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Instrument">
            <select name="instrumentFocus" className="input" defaultValue={song?.instrumentFocus ?? 'guitar'}>
              <option value="guitar">Guitar</option>
              <option value="bass">Bass</option>
              <option value="both">Both</option>
            </select>
          </Field>
        </div>

        <Field label="Chord Progression">
          <input name="chordProgression" placeholder="e.g. G - F#m - C - D" className="input"
            defaultValue={song ? (song.chordProgression as string[]).join(' - ') : ''} />
          <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>Separate chords with spaces or dashes</p>
        </Field>

        <Field label="Practice Status">
          <select name="practiceStatus" className="input" defaultValue={song?.practiceStatus ?? 'wantToLearn'}>
            <option value="wantToLearn">Want to Learn</option>
            <option value="learning">Learning</option>
            <option value="comfortable">Comfortable</option>
            <option value="performanceReady">Performance Ready</option>
          </select>
        </Field>

        <div className="card p-4 flex flex-col gap-3">
          <p className="section-label">External Links</p>
          <Field label="Spotify URL">
            <input name="spotifyUrl" type="url" placeholder="https://open.spotify.com/…" className="input" defaultValue={song?.spotifyUrl ?? ''} />
          </Field>
          <Field label="Tab / Notation URL">
            <input name="tabUrl" type="url" placeholder="https://www.ultimate-guitar.com/…" className="input" defaultValue={song?.tabUrl ?? ''} />
          </Field>
          <Field label="YouTube URL">
            <input name="youtubeUrl" type="url" placeholder="https://youtube.com/…" className="input" defaultValue={song?.youtubeUrl ?? ''} />
          </Field>
        </div>

        <Field label="Notes">
          <textarea name="notes" rows={3} className="input" defaultValue={song?.notes ?? ''} />
        </Field>

        <Field label="Tags">
          <input name="tags" placeholder="e.g. blues, acoustic, fingerpicking" className="input"
            defaultValue={song ? (song.tags as string[]).join(', ') : ''} />
        </Field>

        <button type="submit" className="btn-primary justify-center py-2.5 mt-1" style={{ fontSize: 14 }}>
          {isEdit ? 'Save Changes' : 'Add Song'}
        </button>
      </form>
    </div>
  )
}
