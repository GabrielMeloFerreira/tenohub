'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { JSONContent } from '@tiptap/react'

import { newId } from '@/lib/id'
import * as actions from '../server/actions'
import type { Note } from '../types'
import { emptyDoc } from '../utils'

const SAVE_DEBOUNCE_MS = 800

type Patch = { title?: string; content?: JSONContent }

/**
 * CRUD de notas com escrita otimista, respaldado pelas Server Actions.
 *
 * Fase 3 troca este miolo por TanStack Query + fila de mutações offline — a assinatura
 * pública não muda, então os componentes não são tocados. O debounce e o rollback aqui
 * são a versão mínima do que o TanStack fará de forma mais robusta.
 */
export function useNotes(initialNotes: Note[]) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)

  // Timers e patches acumulados por nota, para não bater no banco a cada tecla.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const pending = useRef<Map<string, Patch>>(new Map())

  useEffect(() => {
    const map = timers.current
    return () => map.forEach(clearTimeout)
  }, [])

  const flush = useCallback((id: string) => {
    const patch = pending.current.get(id)
    pending.current.delete(id)
    timers.current.delete(id)
    if (!patch) return
    actions.updateNote({ id, ...patch }).catch((err) => {
      console.error('Falha ao salvar nota', id, err)
    })
  }, [])

  const createNote = useCallback((): Note => {
    const now = new Date()
    const note: Note = {
      id: newId(),
      userId: '', // preenchido no servidor a partir da sessão; irrelevante no cliente
      folderId: null,
      title: '',
      content: emptyDoc(),
      plainText: '',
      wordCount: 0,
      isPinned: false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    setNotes((prev) => [note, ...prev])
    actions.createNote({ id: note.id, title: note.title, content: note.content }).catch((err) => {
      console.error('Falha ao criar nota', err)
      setNotes((prev) => prev.filter((n) => n.id !== note.id))
    })
    return note
  }, [])

  const updateNote = useCallback(
    (id: string, patch: Patch) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date() } : n))
      )

      pending.current.set(id, { ...pending.current.get(id), ...patch })
      const existing = timers.current.get(id)
      if (existing) clearTimeout(existing)
      timers.current.set(id, setTimeout(() => flush(id), SAVE_DEBOUNCE_MS))
    },
    [flush]
  )

  const deleteNote = useCallback((id: string) => {
    const snapshot = notes
    setNotes((prev) => prev.filter((n) => n.id !== id))
    actions.deleteNote({ id }).catch((err) => {
      console.error('Falha ao excluir nota', id, err)
      setNotes(snapshot)
    })
  }, [notes])

  return { notes, createNote, updateNote, deleteNote }
}
