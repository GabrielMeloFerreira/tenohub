'use server'

import { and, eq } from 'drizzle-orm'
import type { JSONContent } from '@tiptap/react'

import { db } from '@/server/db'
import { notes } from '@/server/db/schema'
import { requireUser } from '@/server/auth'
import { countWords, extractPlainText } from '../utils'
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
  type CreateNoteInput,
  type UpdateNoteInput,
} from './schema'

// Deriva os campos de busca a partir do documento, no servidor, na hora de salvar.
function searchFields(content: JSONContent) {
  const plainText = extractPlainText(content)
  return { plainText, wordCount: countWords(plainText) }
}

export async function createNote(input: CreateNoteInput) {
  const user = await requireUser()
  const data = createNoteSchema.parse(input)

  await db.insert(notes).values({
    id: data.id,
    userId: user.id,
    title: data.title,
    content: data.content,
    ...searchFields(data.content),
  })
}

export async function updateNote(input: UpdateNoteInput) {
  const user = await requireUser()
  const data = updateNoteSchema.parse(input)

  const patch: Partial<typeof notes.$inferInsert> = { updatedAt: new Date() }
  if (data.title !== undefined) patch.title = data.title
  if (data.content !== undefined) {
    patch.content = data.content
    Object.assign(patch, searchFields(data.content))
  }

  // O filtro por userId aqui não é redundância: garante que ninguém edite nota alheia
  // forjando um id, mesmo que o RLS esteja desligado por engano.
  await db
    .update(notes)
    .set(patch)
    .where(and(eq(notes.id, data.id), eq(notes.userId, user.id)))
}

export async function deleteNote(input: { id: string }) {
  const user = await requireUser()
  const { id } = noteIdSchema.parse(input)

  // Soft delete — a nota vai para a lixeira, não some (docs/plans/04-organizacao.md §4.6).
  await db
    .update(notes)
    .set({ deletedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
}

export async function restoreNote(input: { id: string }) {
  const user = await requireUser()
  const { id } = noteIdSchema.parse(input)

  await db
    .update(notes)
    .set({ deletedAt: null })
    .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
}
