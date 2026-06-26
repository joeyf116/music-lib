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
    setTitle(song.title); setArtist(song.artist); setKey(song.key ?? '')
    setCapo(song.capo ?? ''); setTuning(song.tuning ?? ''); setDifficulty(song.difficulty)
    setInstrumentFocus(song.instrumentFocus); setSpotifyUrl(song.spotifyUrl ?? '')
    setTabUrl(song.tabUrl ?? ''); setYoutubeUrl(song.youtubeUrl ?? '')
    setProgressionRaw(song.chordProgression.join(' - ')); setNotes(song.notes ?? '')
    setTagsRaw(song.tags.join(', ')); setStatus(song.practiceStatus)
  }, [songId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const song: Song = {
      id: songId ?? newId(), title, artist,
      key: key || undefined, capo: capo || undefined, tuning: tuning || undefined,
      difficulty, instrumentFocus,
      spotifyUrl: spotifyUrl || undefined, tabUrl: tabUrl || undefined, youtubeUrl: youtubeUrl || undefined,
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
      <h1 className="page-title mb-6">{isEdit ? 'Edit Song' : 'Add Song'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title *">
            <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Artist *">
            <input required className="input" value={artist} onChange={(e) => setArtist(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Key">
            <input placeholder="e.g. C#m" className="input" value={key} onChange={(e) => setKey(e.target.value)} />
          </Field>
          <Field label="Capo">
            <input placeholder="e.g. 2" className="input" value={capo} onChange={(e) => setCapo(e.target.value)} />
          </Field>
          <Field label="Tuning">
            <input placeholder="Standard" className="input" value={tuning} onChange={(e) => setTuning(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Difficulty">
            <select className="input" value={difficulty ?? ''} onChange={(e) => setDifficulty((e.target.value || undefined) as Song['difficulty'])}>
              <option value="">—</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Instrument">
            <select className="input" value={instrumentFocus} onChange={(e) => setInstrumentFocus(e.target.value as Song['instrumentFocus'])}>
              <option value="guitar">Guitar</option>
              <option value="bass">Bass</option>
              <option value="both">Both</option>
            </select>
          </Field>
        </div>

        <Field label="Chord Progression">
          <input placeholder="e.g. G - F#m - C - D" className="input" value={progressionRaw} onChange={(e) => setProgressionRaw(e.target.value)} />
          <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>Separate chords with spaces or dashes</p>
        </Field>

        <Field label="Practice Status">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as PracticeStatus)}>
            {STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>

        <div className="card p-4 flex flex-col gap-3">
          <p className="section-label">External Links</p>
          <Field label="Spotify URL">
            <input type="url" placeholder="https://open.spotify.com/…" className="input" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
          </Field>
          <Field label="Tab / Notation URL">
            <input type="url" placeholder="https://www.ultimate-guitar.com/…" className="input" value={tabUrl} onChange={(e) => setTabUrl(e.target.value)} />
          </Field>
          <Field label="YouTube URL">
            <input type="url" placeholder="https://youtube.com/…" className="input" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          </Field>
        </div>

        <Field label="Notes">
          <textarea rows={3} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>

        <Field label="Tags">
          <input placeholder="e.g. blues, acoustic, fingerpicking" className="input" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} />
        </Field>

        <button type="submit" className="btn-primary justify-center py-2.5 mt-1" style={{ fontSize: 14 }}>
          {isEdit ? 'Save Changes' : 'Add Song'}
        </button>
      </form>
    </div>
  )
}
