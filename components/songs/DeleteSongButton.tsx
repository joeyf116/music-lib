'use client'

import { Trash2 } from 'lucide-react'
import { deleteSong } from '@/app/actions/songs'

export default function DeleteSongButton({ id, title }: { id: string; title: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteSong(id)
  }
  return (
    <button onClick={handleDelete} className="btn-danger">
      <Trash2 size={12} /> Delete
    </button>
  )
}
