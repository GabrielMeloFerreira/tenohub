import { z } from 'zod'

import { FOLDER_COLORS } from '../colors'

export const createFolderSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Informe um nome.').max(120),
  color: z.enum(FOLDER_COLORS).default('gray'),
})

export const renameFolderSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Informe um nome.').max(120),
})

export const folderIdSchema = z.object({ id: z.uuid() })

export type CreateFolderInput = z.infer<typeof createFolderSchema>
export type RenameFolderInput = z.infer<typeof renameFolderSchema>
