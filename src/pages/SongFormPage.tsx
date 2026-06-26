import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getSongs, saveSong } from '../lib/storage/index.ts'
import type { Song, PracticeStatus } from '../types.ts'
import { parseProgression } from '../lib/music/chords.ts'

function newId() {
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const STATUS_OPTIONS: { value: PracticeStatus; label: string }[] = [
  { value: 'wantToLearn', label: 'Want to Learn' },
  { value: 'learning', label: 'Learning' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'performanceReady', label: 'Performance Ready' },
]

export default function SongFormPage() {
  const { songId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(songId)

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [capo, setCapo] = useState('')
  const [tuning, setTuning] = useState('')
  const [difficulty, setDifficulty] = useState<Song['difficulty']>(undefined)
  const [instrumentFocus, setInstrumentFocus] = useState<Song['instrumentFocus']>('guitar')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [tabUrl, setTabUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [progressionRaw, setProgressionRaw] = useState('')
  const [notes, setNotes] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')
  const [status, setStatus] = useState<PracticeStatus>('wantToLearn')

  useEffect(() => {
    if (!songId) return
    const song = getSongs().find((s) => s.id === songId)
    if (!song) return
    setTitle(song.title)
    setArtist(song.artist)
    setKey(song.key ?? '')
    setCapo(song.capo ?? '')
    setTuning(song.tuning ?? '')
    setDifficulty(song.difficulty)
    setInstrumentFocus(song.instrumentFocus)
    setSpotifyUrl(song.spotifyUrl ?? '')
    setTabUrl(song.tabUrl ?? '')
    setYoutubeUrl(song.youtubeUrl ?? '')
    setProgressionRaw(song.chordProgression.join(' - '))
    setNotes(song.notes ?? '')
    setTagsRaw(song.tags.join(', '))
    setStatus(song.practiceStatus)
  }, [songId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const song: Song = {
      id: songId ?? newId(),
      title,
      artist,
      key: key || undefined,
      capo: capo || undefined,
      tuning: tuning || undefined,
      difficulty,
      instrumentFocus,
      spotifyUrl: spotifyUrl || undefined,
      tabUrl: tabUrl || undefined,
      youtubeUrl: youtubeUrl || undefined,
      chordProgression: parseProgression(progressionRaw),
      notes: notes || undefined,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
      practiceStatus: status,
      createdAt: isEdit ? (getSongs().find((s) => s.id === songId)?.createdAt ?? now) : now,
      updatedAt: now,
    }
    saveSong(song)
    navigate(`/songs/${song.id}`)
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border text-sm'
  const inputStyle = {
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  }
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider mb-1'
  const labelStyle = { color: 'var(--color-muted)' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--color-muted)' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
        {isEdit ? 'Edit Song' : 'Add Song'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Title *</label>
            <input required className={inputClass} style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Artist *</label>
            <input required className={inputClass} style={inputStyle} value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Key</label>
            <input placeholder="e.g. C#m" className={inputClass} style={inputStyle} value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Capo</label>
            <input placeholder="e.g. 2" className={inputClass} style={inputStyle} value={capo} onChange={(e) => setCapo(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Tuning</label>
            <input placeholder="Standard" className={inputClass} style={inputStyle} value={tuning} onChange={(e) => setTuning(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Difficulty</label>
            <select className={inputClass} style={inputStyle} value={difficulty ?? ''} onChange={(e) => setDifficulty((e.target.value || undefined) as Song['difficulty'])}>
              <option value="">—</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Instrument</label>
            <select className={inputClass} style={inputStyle} value={instrumentFocus} onChange={(e) => setInstrumentFocus(e.target.value as Song['instrumentFocus'])}>
              <option value="guitar">Guitar</option>
              <option value="bass">Bass</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Chord Progression</label>
          <input
            placeholder="e.g. G - F#m - C - D"
            className={inputClass}
            style={inputStyle}
            value={progressionRaw}
            onChange={(e) => setProgressionRaw(e.target.value)}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Separate chords with spaces or dashes</p>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Practice Status</label>
          <select className={inputClass} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as PracticeStatus)}>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Spotify URL</label>
          <input type="url" placeholder="https://open.spotify.com/…" className={inputClass} style={inputStyle} value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Tab / Notation URL</label>
          <input type="url" placeholder="https://www.ultimate-guitar.com/…" className={inputClass} style={inputStyle} value={tabUrl} onChange={(e) => setTabUrl(e.target.value)} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>YouTube URL</label>
          <input type="url" placeholder="https://youtube.com/…" className={inputClass} style={inputStyle} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Notes</label>
          <textarea
            rows={3}
            className={inputClass}
            style={inputStyle}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Tags</label>
          <input placeholder="e.g. blues, acoustic, fingerpicking" className={inputClass} style={inputStyle} value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} />
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-lg font-semibold text-white mt-2"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          {isEdit ? 'Save Changes' : 'Add Song'}
        </button>
      </form>
    </div>
  )
}
