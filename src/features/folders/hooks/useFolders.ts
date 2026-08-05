'use client'

import { useCallback } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { newId } from '@/lib/id'
import { mutationKeys, queryKeys } from '@/lib/query-keys'
import type {
  CreateFolderVars,
  DeleteFolderVars,
  RenameFolderVars,
} from '../query'
import * as actions from '../server/actions'
import type { FolderColor } from '../colors'
import type { FolderWithCount } from '../types'

export function useFolders(initialFolders: FolderWithCount[]) {
  const { data: folders = [] } = useQuery({
    queryKey: queryKeys.folders.list(),
    queryFn: () => actions.listFolders(),
    initialData: initialFolders,
  })

  const createMut = useMutation<void, Error, CreateFolderVars>({
    mutationKey: mutationKeys.folders.create,
  })
  const renameMut = useMutation<void, Error, RenameFolderVars>({
    mutationKey: mutationKeys.folders.rename,
  })
  const deleteMut = useMutation<void, Error, DeleteFolderVars>({
    mutationKey: mutationKeys.folders.delete,
  })

  const createFolder = useCallback(
    (name: string, color: FolderColor = 'gray') => {
      const folder: FolderWithCount = {
        id: newId(),
        userId: '',
        name,
        color,
        position: folders.length,
        createdAt: new Date(),
        deletedAt: null,
        noteCount: 0,
      }
      createMut.mutate(folder)
      return folder.id
    },
    [createMut, folders.length]
  )

  const renameFolder = useCallback(
    (id: string, name: string) => renameMut.mutate({ id, name }),
    [renameMut]
  )

  const deleteFolder = useCallback((id: string) => deleteMut.mutate({ id }), [deleteMut])

  return { folders, createFolder, renameFolder, deleteFolder }
}
