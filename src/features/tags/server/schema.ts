import { z } from 'zod'

export const tagNameSchema = z
  .string()
  .trim()
  .min(1, 'Informe um nome.')
  .max(40, 'Tag muito longa.')
  .transform((s) => s.replace(/^#/, '').trim())
  .refine((s) => s.length > 0, 'Informe um nome.')

export const createTagSchema = z.object({
  id: z.uuid(),
  name: tagNameSchema,
})

export const addTagToNoteSchema = z.object({
  noteId: z.uuid(),
  tagId: z.uuid(),
  name: tagNameSchema,
})

export const removeTagFromNoteSchema = z.object({
  noteId: z.uuid(),
  tagId: z.uuid(),
})

export type CreateTagInput = z.infer<typeof createTagSchema>
export type AddTagToNoteInput = z.infer<typeof addTagToNoteSchema>
export type RemoveTagFromNoteInput = z.infer<typeof removeTagFromNoteSchema>
