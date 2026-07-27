import { QueryClient } from '@tanstack/react-query'

import * as noteActions from '@/features/notes/server/actions'
import type { Note } from '@/features/notes/types'
import { mutationKeys, queryKeys } from './query-keys'

export type CreateVars = Note
export type UpdateVars = { id: string; patch: { title?: string; content?: Note['content'] } }
export type DeleteVars = { id: string }

const listKey = queryKeys.notes.list()

function getList(qc: QueryClient): Note[] {
  return qc.getQueryData<Note[]>(listKey) ?? []
}

/**
 * Cria o QueryClient com as mutations definidas POR CHAVE.
 *
 * Definir mutationFn/onMutate/onError aqui (e nao inline no useMutation) e o que permite
 * a fila offline resumir depois de um reload: a mutacao persistida so guarda a chave e as
 * variaveis; a funcao e recuperada daqui por chave. Ver docs/plans/03-sync-offline.md.
 */
export function makeQueryClient() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // nota e dado de dono unico; refetch agressivo so gasta banda
        retry: 2,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 5,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      },
    },
  })

  // CREATE — variaveis sao a Note otimista completa; o servidor recebe so o essencial.
  qc.setMutationDefaults(mutationKeys.notes.create, {
    mutationFn: (note: Note) =>
      noteActions.createNote({ id: note.id, title: note.title, content: note.content }),
    onMutate: async (note: Note) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<Note[]>(listKey, [note, ...prev.filter((n) => n.id !== note.id)])
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  // UPDATE — aplica o patch na nota em cache e sobe pro servidor.
  qc.setMutationDefaults(mutationKeys.notes.update, {
    mutationFn: ({ id, patch }: UpdateVars) => noteActions.updateNote({ id, ...patch }),
    onMutate: async ({ id, patch }: UpdateVars) => {
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

  // DELETE — soft delete; remove da listagem otimisticamente.
  qc.setMutationDefaults(mutationKeys.notes.delete, {
    mutationFn: ({ id }: DeleteVars) => noteActions.deleteNote({ id }),
    onMutate: async ({ id }: DeleteVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<Note[]>(listKey, prev.filter((n) => n.id !== id))
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  return qc
}
