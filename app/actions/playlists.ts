'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { playlists } from '@/lib/db/schema'
import { newPlaylistId, parsePlaylistFields } from '@/lib/form-parsing'

export async function createPlaylist(formData: FormData) {
  const id = newPlaylistId()
  await db.insert(playlists).values({ id, ...parsePlaylistFields(formData) })
  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function updatePlaylist(id: string, formData: FormData) {
  await db.update(playlists).set({ ...parsePlaylistFields(formData), updatedAt: new Date() }).where(eq(playlists.id, id))
  revalidatePath(`/playlists/${id}`)
  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function deletePlaylist(id: string) {
  await db.delete(playlists).where(eq(playlists.id, id))
  revalidatePath('/playlists')
  redirect('/playlists')
}
