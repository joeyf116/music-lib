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
    setName(pl.name)
    setDescription(pl.description ?? '')
    setSongIds(pl.songIds)
    setTagsRaw(pl.tags.join(', '))
    setPracticeGoal(pl.practiceGoal ?? '')
  }, [playlistId])

  function toggleSong(id: string) {
    setSongIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const playlist: Playlist = {
      id: playlistId ?? newId(),
      name,
      description: description || undefined,
      songIds,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
      practiceGoal: practiceGoal || undefined,
      createdAt: isEdit ? (getPlaylists().find((p) => p.id === playlistId)?.createdAt ?? now) : now,
      updatedAt: now,
    }
    savePlaylist(playlist)
    navigate(`/playlists/${playlist.id}`)
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border text-sm'
  const inputStyle = { backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider mb-1'
  const labelStyle = { color: 'var(--color-muted)' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--color-muted)' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
        {isEdit ? 'Edit Playlist' : 'New Playlist'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={labelClass} style={labelStyle}>Name *</label>
          <input required className={inputClass} style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Description</label>
          <input className={inputClass} style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Practice Goal</label>
          <input placeholder="e.g. Learn 5 fingerpicking songs" className={inputClass} style={inputStyle} value={practiceGoal} onChange={(e) => setPracticeGoal(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Tags</label>
          <input placeholder="e.g. acoustic, blues" className={inputClass} style={inputStyle} value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Songs ({songIds.length} selected)</label>
          {allSongs.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No songs yet. Add songs first.</p>
          )}
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-lg border p-1" style={{ borderColor: 'var(--color-border)' }}>
            {allSongs.map((song) => {
              const selected = songIds.includes(song.id)
              return (
                <button
                  type="button"
                  key={song.id}
                  onClick={() => toggleSong(song.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: selected ? 'var(--color-accent-subtle)' : 'transparent', color: 'var(--color-text)' }}
                >
                  <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: selected ? 'var(--color-accent)' : 'var(--color-border)', backgroundColor: selected ? 'var(--color-accent)' : 'transparent' }}>
                    {selected && <Check size={10} color="#fff" />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{song.title}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>{song.artist}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" className="px-6 py-3 rounded-lg font-semibold text-white mt-2" style={{ backgroundColor: 'var(--color-accent)' }}>
          {isEdit ? 'Save Changes' : 'Create Playlist'}
        </button>
      </form>
    </div>
  )
}
