'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { playlists } from '@/lib/db/schema'

function newId() {
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function createPlaylist(formData: FormData) {
  const id = newId()
  const songIds = formData.getAll('songIds') as string[]
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  await db.insert(playlists).values({
    id,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    songIds,
    tags,
    practiceGoal: (formData.get('practiceGoal') as string) || null,
  })

  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function updatePlaylist(id: string, formData: FormData) {
  const songIds = formData.getAll('songIds') as string[]
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  await db.update(playlists).set({
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    songIds,
    tags,
    practiceGoal: (formData.get('practiceGoal') as string) || null,
    updatedAt: new Date(),
  }).where(eq(playlists.id, id))

  revalidatePath(`/playlists/${id}`)
  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function deletePlaylist(id: string) {
  await db.delete(playlists).where(eq(playlists.id, id))
  revalidatePath('/playlists')
  redirect('/playlists')
}
