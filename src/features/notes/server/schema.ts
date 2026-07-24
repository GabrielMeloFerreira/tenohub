import { z } from 'zod'
import type { JSONContent } from '@tiptap/react'

// Documento do TipTap. Não validamos a estrutura interna a fundo — só que é um objeto.
const contentSchema = z.custom<JSONContent>(
  (v) => typeof v === 'object' && v !== null,
  { message: 'content inválido' }
)

export const createNoteSchema = z.object({
  id: z.uuid(),
  title: z.string().max(500).default(''),
  content: contentSchema,
})

export const updateNoteSchema = z.object({
  id: z.uuid(),
  title: z.string().max(500).optional(),
  content: contentSchema.optional(),
})

export const noteIdSchema = z.object({ id: z.uuid() })

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
