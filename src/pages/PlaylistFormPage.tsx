import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { getPlaylists, savePlaylist, getSongs } from '../lib/storage/index.ts'
import type { Playlist } from '../types.ts'

function newId() {
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function PlaylistFormPage() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(playlistId)
  const allSongs = getSongs()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [songIds, setSongIds] = useState<string[]>([])
  const [tagsRaw, setTagsRaw] = useState('')
  const [practiceGoal, setPracticeGoal] = useState('')

  useEffect(() => {
    if (!playlistId) return
    const pl = getPlaylists().find((p) => p.id === playlistId)
    if (!pl) return
    setName(pl.name); setDescription(pl.description ?? ''); setSongIds(pl.songIds)
    setTagsRaw(pl.tags.join(', ')); setPracticeGoal(pl.practiceGoal ?? '')
  }, [playlistId])

  function toggleSong(id: string) {
    setSongIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const playlist: Playlist = {
      id: playlistId ?? newId(), name,
      description: description || undefined, songIds,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
      practiceGoal: practiceGoal || undefined,
      createdAt: isEdit ? (getPlaylists().find((p) => p.id === playlistId)?.createdAt ?? now) : now,
      updatedAt: now,
    }
    savePlaylist(playlist)
    navigate(`/playlists/${playlist.id}`)
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="section-label block mb-1.5">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 mb-5" style={{ color: 'var(--color-muted)', fontSize: 13 }}>
        <ArrowLeft size={13} /> Back
      </button>
      <h1 className="page-title mb-6">{isEdit ? 'Edit Playlist' : 'New Playlist'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name *">
          <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Description">
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Practice Goal">
          <input placeholder="e.g. Learn 5 fingerpicking songs" className="input" value={practiceGoal} onChange={(e) => setPracticeGoal(e.target.value)} />
        </Field>
        <Field label="Tags">
          <input placeholder="e.g. acoustic, blues" className="input" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} />
        </Field>

        <div>
          <p className="section-label mb-2">Songs ({songIds.length} selected)</p>
          {allSongs.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>No songs yet. Add songs first.</p>
          ) : (
            <div className="card overflow-hidden max-h-64 overflow-y-auto">
              {allSongs.map((song, i) => {
                const selected = songIds.includes(song.id)
                return (
                  <button
                    type="button"
                    key={song.id}
                    onClick={() => toggleSong(song.id)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left card-hover"
                    style={{
                      borderBottom: i < allSongs.length - 1 ? '1px solid var(--color-border)' : 'none',
                      backgroundColor: selected ? 'var(--color-accent-subtle)' : 'transparent',
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
                        backgroundColor: selected ? 'var(--color-accent)' : 'transparent',
                      }}
                    >
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
