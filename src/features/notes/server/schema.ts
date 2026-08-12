import { z } from 'zod'
import type { JSONContent } from '@tiptap/react'

const contentSchema = z.custom<JSONContent>((v) => typeof v === 'object' && v !== null, {
  message: 'content invalido',
})

export const createNoteSchema = z.object({
  id: z.uuid(),
  title: z.string().max(500).default(''),
  content: contentSchema,
})

export const updateNoteSchema = z.object({
  id: z.uuid(),
  title: z.string().max(500).optional(),
  content: contentSchema.optional(),
  isFavorite: z.boolean().optional(),
})

export const moveNoteSchema = z.object({
  id: z.uuid(),
  folderId: z.uuid().nullable(),
})

export const noteIdSchema = z.object({ id: z.uuid() })

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
export type MoveNoteInput = z.infer<typeof moveNoteSchema>
