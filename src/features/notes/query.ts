import type { QueryClient } from '@tanstack/react-query'

import { mutationKeys, queryKeys } from '@/lib/query-keys'
import * as noteActions from './server/actions'
import type { Note } from './types'

export type CreateNoteVars = Note
export type UpdateNoteVars = { id: string; patch: { title?: string; content?: Note['content'] } }
export type DeleteNoteVars = { id: string }

const listKey = queryKeys.notes.list()
const getList = (qc: QueryClient) => qc.getQueryData<Note[]>(listKey) ?? []

export function registerNoteMutations(qc: QueryClient) {
  qc.setMutationDefaults(mutationKeys.notes.create, {
    mutationFn: (note: CreateNoteVars) =>
      noteActions.createNote({ id: note.id, title: note.title, content: note.content }),
    onMutate: async (note: CreateNoteVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<Note[]>(listKey, [note, ...prev.filter((n) => n.id !== note.id)])
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  qc.setMutationDefaults(mutationKeys.notes.update, {
    mutationFn: ({ id, patch }: UpdateNoteVars) => noteActions.updateNote({ id, ...patch }),
    onMutate: async ({ id, patch }: UpdateNoteVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<Note[]>(
        listKey,
        prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date() } : n))
      )
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  qc.setMutationDefaults(mutationKeys.notes.delete, {
    mutationFn: ({ id }: DeleteNoteVars) => noteActions.deleteNote({ id }),
    onMutate: async ({ id }: DeleteNoteVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<Note[]>(
        listKey,
        prev.filter((n) => n.id !== id)
      )
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })
}
