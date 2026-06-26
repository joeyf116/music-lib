'use client'

import { Trash2 } from 'lucide-react'
import { deletePlaylist } from '@/app/actions/playlists'

export default function DeletePlaylistButton({ id, name }: { id: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${name}"?`)) return
    await deletePlaylist(id)
  }
  return (
    <button onClick={handleDelete} className="btn-danger">
      <Trash2 size={12} /> Delete
    </button>
  )
}
