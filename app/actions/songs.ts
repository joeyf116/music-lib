'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { songs } from '@/lib/db/schema'
import { newSongId, parseSongFields } from '@/lib/form-parsing'

export async function createSong(formData: FormData) {
  const id = newSongId()
  await db.insert(songs).values({ id, ...parseSongFields(formData) })
  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function updateSong(id: string, formData: FormData) {
  await db.update(songs).set({ ...parseSongFields(formData), updatedAt: new Date() }).where(eq(songs.id, id))
  revalidatePath(`/songs/${id}`)
  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function deleteSong(id: string) {
  await db.delete(songs).where(eq(songs.id, id))
  revalidatePath('/songs')
  redirect('/songs')
}
