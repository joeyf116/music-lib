'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  parsePlaylistFields,
  insertPlaylist,
  updatePlaylist as dbUpdatePlaylist,
  removePlaylist,
} from '@/lib/playlists/repository'

export async function createPlaylist(formData: FormData) {
  const id = await insertPlaylist(parsePlaylistFields(formData))
  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function updatePlaylist(id: string, formData: FormData) {
  await dbUpdatePlaylist(id, parsePlaylistFields(formData))
  revalidatePath(`/playlists/${id}`)
  revalidatePath('/playlists')
  redirect(`/playlists/${id}`)
}

export async function deletePlaylist(id: string) {
  await removePlaylist(id)
  revalidatePath('/playlists')
  redirect('/playlists')
}
