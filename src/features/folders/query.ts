import type { QueryClient } from '@tanstack/react-query'

import { mutationKeys, queryKeys } from '@/lib/query-keys'
import type { FolderColor } from './colors'
import * as folderActions from './server/actions'
import type { FolderWithCount } from './types'

export type CreateFolderVars = FolderWithCount
export type RenameFolderVars = { id: string; name: string }
export type DeleteFolderVars = { id: string }

const listKey = queryKeys.folders.list()
const getList = (qc: QueryClient) => qc.getQueryData<FolderWithCount[]>(listKey) ?? []

export function registerFolderMutations(qc: QueryClient) {
  qc.setMutationDefaults(mutationKeys.folders.create, {
    mutationFn: (folder: CreateFolderVars) =>
      folderActions.createFolder({
        id: folder.id,
        name: folder.name,
        color: folder.color as FolderColor,
      }),
    onMutate: async (folder: CreateFolderVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<FolderWithCount[]>(listKey, [...prev.filter((f) => f.id !== folder.id), folder])
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  qc.setMutationDefaults(mutationKeys.folders.rename, {
    mutationFn: ({ id, name }: RenameFolderVars) => folderActions.renameFolder({ id, name }),
    onMutate: async ({ id, name }: RenameFolderVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<FolderWithCount[]>(
        listKey,
        prev.map((f) => (f.id === id ? { ...f, name } : f))
      )
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })

  qc.setMutationDefaults(mutationKeys.folders.delete, {
    mutationFn: ({ id }: DeleteFolderVars) => folderActions.deleteFolder({ id }),
    onMutate: async ({ id }: DeleteFolderVars) => {
      await qc.cancelQueries({ queryKey: listKey })
      const prev = getList(qc)
      qc.setQueryData<FolderWithCount[]>(
        listKey,
        prev.filter((f) => f.id !== id)
      )
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev)
    },
  })
}
