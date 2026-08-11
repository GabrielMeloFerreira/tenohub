'use server'

import { and, desc, eq, isNull } from 'drizzle-orm'
import type { JSONContent } from '@tiptap/react'

import { db } from '@/server/db'
import { notes } from '@/server/db/schema'
import { requireUser } from '@/server/auth'
import { countWords, extractPlainText } from '../utils'
import type { Note } from '../types'
import {
  createNoteSchema,
  moveNoteSchema,
  noteIdSchema,
  updateNoteSchema,
  type CreateNoteInput,
  type MoveNoteInput,
  type UpdateNoteInput,
} from './schema'

// Deriva os campos de busca a partir do documento, no servidor, na hora de salvar.
function searchFields(content: JSONContent) {
  const plainText = extractPlainText(content)
  return { plainText, wordCount: countWords(plainText) }
}

/** Listagem chamável do cliente — é o queryFn do TanStack Query (refetch, offline). */
export async function listNotes(): Promise<Note[]> {
  const user = await requireUser()
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, user.id), isNull(notes.deletedAt)))
    .orderBy(desc(notes.updatedAt))
}

export async function createNote(input: CreateNoteInput) {
  const user = await requireUser()
  const data = createNoteSchema.parse(input)

  // Upsert por id (idempotente). O id vem do cliente, então um retry da fila offline
  // reenvia o mesmo createNote sem duplicar a nota. Ver docs/plans/03-sync-offline.md.
  await db
    .insert(notes)
    .values({
      id: data.id,
      userId: user.id,
      title: data.title,
      content: data.content,
      ...searchFields(data.content),
    })
    .onConflictDoUpdate({
      target: notes.id,
      set: {
        title: data.title,
        content: data.content,
        ...searchFields(data.content),
      },
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

export async function moveNote(input: MoveNoteInput) {
  const user = await requireUser()
  const data = moveNoteSchema.parse(input)

  await db
    .update(notes)
    .set({ folderId: data.folderId, updatedAt: new Date() })
    .where(and(eq(notes.id, data.id), eq(notes.userId, user.id)))
}

export async function deleteNote(input: { id: string }) {
  const user = await requireUser()
  const { id } = noteIdSchema.parse(input)

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
