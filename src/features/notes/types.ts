import type { JSONContent } from '@tiptap/react'

export type Note = {
  id: string
  title: string
  /**
   * Documento do TipTap em JSON — nunca HTML. Permite extrair texto puro para busca,
   * contar palavras e transformar sem parsear string (ver docs/plans/00-roadmap.md).
   */
  content: JSONContent
  createdAt: Date
  updatedAt: Date
}

/*
 * Fase 2: este arquivo vira a fachada do schema do Drizzle, e os componentes
 * continuam importando daqui — nunca de `@/server/db`.
 *
 *   import type { notes } from '@/server/db/schema'
 *   export type Note = typeof notes.$inferSelect
 *   export type NewNote = typeof notes.$inferInsert
 */
