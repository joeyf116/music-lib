'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  parseSongFields,
  insertSong,
  updateSong as dbUpdateSong,
  removeSong,
} from '@/lib/songs/repository'

export async function createSong(formData: FormData) {
  const id = await insertSong(parseSongFields(formData))
  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function updateSong(id: string, formData: FormData) {
  await dbUpdateSong(id, parseSongFields(formData))
  revalidatePath(`/songs/${id}`)
  revalidatePath('/songs')
  redirect(`/songs/${id}`)
}

export async function deleteSong(id: string) {
  await removeSong(id)
  revalidatePath('/songs')
  redirect('/songs')
}
