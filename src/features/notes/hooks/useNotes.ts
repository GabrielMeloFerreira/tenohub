'use client'

import { useCallback, useState } from 'react'
import type { JSONContent } from '@tiptap/react'

import { newId } from '@/lib/id'
import { mockNotes } from '../mock-notes'
import type { Note } from '../types'
import { emptyDoc } from '../utils'

/**
 * CRUD de notas em memória.
 *
 * Na fase 2 a implementação passa a chamar server actions via TanStack Query —
 * a assinatura pública deste hook não muda, então os componentes não são tocados.
 */
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(mockNotes)

  const createNote = useCallback((): Note => {
    const now = new Date()
    const note: Note = {
      id: newId(),
      title: '',
      content: emptyDoc(),
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => [note, ...prev])
    return note
  }, [])

  const updateNote = useCallback(
    (id: string, patch: { title?: string; content?: JSONContent }) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...patch, updatedAt: new Date() } : note
        )
      )
    },
    []
  )

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  return { notes, createNote, updateNote, deleteNote }
}
