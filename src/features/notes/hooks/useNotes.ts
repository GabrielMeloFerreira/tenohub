'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { JSONContent } from '@tiptap/react'

import { newId } from '@/lib/id'
import { mutationKeys, queryKeys } from '@/lib/query-keys'
import type { CreateVars, DeleteVars, UpdateVars } from '@/lib/query-client'
import * as actions from '../server/actions'
import type { Note } from '../types'
import { emptyDoc } from '../utils'

const SAVE_DEBOUNCE_MS = 800

type Patch = { title?: string; content?: JSONContent }

/**
 * CRUD de notas sobre o cache do TanStack Query, com escrita otimista e persistencia
 * via fila de mutacoes (docs/plans/03-sync-offline.md).
 *
 * As mutations sao definidas por chave em makeQueryClient (lib/query-client.ts) — aqui
 * so as disparamos. A escrita no cache e imediata para o input de titulo (controlado)
 * ficar responsivo; o envio ao servidor e debounced.
 */
export function useNotes(initialNotes: Note[]) {
  const qc = useQueryClient()
  const listKey = queryKeys.notes.list()

  const { data: notes = [] } = useQuery({
    queryKey: listKey,
    queryFn: () => actions.listNotes(),
    initialData: initialNotes,
  })

  const createMut = useMutation<void, Error, CreateVars>({ mutationKey: mutationKeys.notes.create })
  const updateMut = useMutation<void, Error, UpdateVars>({ mutationKey: mutationKeys.notes.update })
  const deleteMut = useMutation<void, Error, DeleteVars>({ mutationKey: mutationKeys.notes.delete })

  // Debounce de persistencia por nota.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const pending = useRef<Map<string, Patch>>(new Map())

  useEffect(() => {
    const map = timers.current
    return () => map.forEach(clearTimeout)
  }, [])

  const flush = useCallback(
    (id: string) => {
      const patch = pending.current.get(id)
      pending.current.delete(id)
      timers.current.delete(id)
      if (!patch) return
      updateMut.mutate({ id, patch })
    },
    [updateMut]
  )

  const createNote = useCallback((): Note => {
    const now = new Date()
    const note: Note = {
      id: newId(),
      userId: '', // preenchido no servidor a partir da sessao
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
    createMut.mutate(note) // onMutate adiciona ao cache
    return note
  }, [createMut])

  const updateNote = useCallback(
    (id: string, patch: Patch) => {
      // Escrita imediata no cache: mantem o input de titulo (controlado por note.title)
      // responsivo e atualiza o preview da sidebar ao vivo.
      qc.setQueryData<Note[]>(listKey, (prev = []) =>
        prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date() } : n))
      )

      pending.current.set(id, { ...pending.current.get(id), ...patch })
      const existing = timers.current.get(id)
      if (existing) clearTimeout(existing)
      timers.current.set(id, setTimeout(() => flush(id), SAVE_DEBOUNCE_MS))
    },
    [qc, listKey, flush]
  )

  const deleteNote = useCallback(
    (id: string) => {
      deleteMut.mutate({ id })
    },
    [deleteMut]
  )

  return { notes, createNote, updateNote, deleteNote }
}
