'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import { parseProgression } from '@/lib/music/chords'

function newId() {
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function createSong(formData: FormData) {
  const id = newId()
  const chordProgression = parseProgression(formData.get('chordProgression') as string)
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  await db.insert(songs).values({
    id,
    title: formData.get('title') as string,
    artist: formData.get('artist') as string,
    key: (formData.get('key') as string) || null,
    capo: (formData.get('capo') as string) || null,
    tuning: (formData.get('tuning') as string) || null,
    difficulty: (formData.get('difficulty') as string) || null,
    instrumentFocus: (formData.get('instrumentFocus') as string) || 'guitar',
    spotifyUrl: (formData.get('spotifyUrl') as string) || null,
    tabUrl: (formData.get('tabUrl') as string) || null,
    youtubeUrl: (formData.get('youtubeUrl') as string) || null,
    chordProgression,
    notes: (formData.get('notes') as string) || null,
    tags,
    practiceStatus: (formData.get('practiceStatus') as string) || 'wantToLearn',
  })

  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function updateSong(id: string, formData: FormData) {
  const chordProgression = parseProgression(formData.get('chordProgression') as string)
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  await db.update(songs).set({
    title: formData.get('title') as string,
    artist: formData.get('artist') as string,
    key: (formData.get('key') as string) || null,
    capo: (formData.get('capo') as string) || null,
    tuning: (formData.get('tuning') as string) || null,
    difficulty: (formData.get('difficulty') as string) || null,
    instrumentFocus: (formData.get('instrumentFocus') as string) || 'guitar',
    spotifyUrl: (formData.get('spotifyUrl') as string) || null,
    tabUrl: (formData.get('tabUrl') as string) || null,
    youtubeUrl: (formData.get('youtubeUrl') as string) || null,
    chordProgression,
    notes: (formData.get('notes') as string) || null,
    tags,
    practiceStatus: (formData.get('practiceStatus') as string) || 'wantToLearn',
    updatedAt: new Date(),
  }).where(eq(songs.id, id))

  revalidatePath(`/songs/${id}`)
  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function deleteSong(id: string) {
  await db.delete(songs).where(eq(songs.id, id))
  revalidatePath('/songs')
  redirect('/songs')
}
