import type { tags } from '@/server/db/schema'

export type Tag = typeof tags.$inferSelect

/** Vínculo nota ↔ tag (tabela note_tags). */
export type NoteTagLink = {
  noteId: string
  tagId: string
}
