'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { createPlaylist, updatePlaylist } from '@/app/actions/playlists'
import type { Playlist } from '@/lib/db/schema'

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

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="section-label block mb-1.5">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <Link href={isEdit ? `/playlists/${playlist!.id}` : '/playlists'} className="flex items-center gap-1.5 mb-5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
        <ArrowLeft size={13} /> Back
      </Link>
      <h1 className="page-title mb-6">{isEdit ? 'Edit Playlist' : 'New Playlist'}</h1>

      <form action={action} className="flex flex-col gap-4">
        <Field label="Name *">
          <input name="name" required className="input" defaultValue={playlist?.name} />
        </Field>
        <Field label="Description">
          <input name="description" className="input" defaultValue={playlist?.description ?? ''} />
        </Field>
        <Field label="Practice Goal">
          <input name="practiceGoal" placeholder="e.g. Learn 5 fingerpicking songs" className="input" defaultValue={playlist?.practiceGoal ?? ''} />
        </Field>
        <Field label="Tags">
          <input name="tags" placeholder="e.g. acoustic, blues" className="input" defaultValue={playlist ? (playlist.tags as string[]).join(', ') : ''} />
        </Field>

        <div>
          <p className="section-label mb-2">Songs ({selectedIds.length} selected)</p>
          {songs.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>No songs yet. Add songs first.</p>
          ) : (
            <div className="card overflow-hidden max-h-64 overflow-y-auto">
              {songs.map((song, i) => {
                const selected = selectedIds.includes(song.id)
                return (
                  <button
                    type="button"
                    key={song.id}
                    onClick={() => toggleSong(song.id)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left"
                    style={{
                      borderBottom: i < songs.length - 1 ? '1px solid var(--color-border)' : 'none',
                      backgroundColor: selected ? 'var(--color-accent-subtle)' : 'transparent',
                    }}
                  >
                    <span className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{ border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border-strong)'}`, backgroundColor: selected ? 'var(--color-accent)' : 'transparent' }}>
                      {selected && <Check size={9} color="#fff" strokeWidth={3} />}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{song.title}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-muted)', marginLeft: 'auto' }}>{song.artist}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary justify-center py-2.5 mt-1" style={{ fontSize: 14 }}>
          {isEdit ? 'Save Changes' : 'Create Playlist'}
        </button>
      </form>
    </div>
  )
}
