'use server'

import { and, eq } from 'drizzle-orm'

import { db } from '@/server/db'
import { noteTags, notes, tags } from '@/server/db/schema'
import { requireUser } from '@/server/auth'
import type { NoteTagLink, Tag } from '../types'
import {
  addTagToNoteSchema,
  removeTagFromNoteSchema,
  type AddTagToNoteInput,
  type RemoveTagFromNoteInput,
} from './schema'

export async function listTags(): Promise<Tag[]> {
  const user = await requireUser()
  return db.select().from(tags).where(eq(tags.userId, user.id)).orderBy(tags.name)
}

/** Todos os vínculos das notas do usuário (para cache do cliente). */
export async function listNoteTagLinks(): Promise<NoteTagLink[]> {
  const user = await requireUser()

  return db
    .select({ noteId: noteTags.noteId, tagId: noteTags.tagId })
    .from(noteTags)
    .innerJoin(notes, eq(notes.id, noteTags.noteId))
    .where(eq(notes.userId, user.id))
}

async function assertNoteOwner(noteId: string, userId: string) {
  const [row] = await db
    .select({ id: notes.id })
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1)
  if (!row) throw new Error('Nota não encontrada.')
}

/**
 * Garante a tag (por nome, único por usuário) e associa à nota.
 * O tagId do cliente é usado só na criação; se o nome já existir, reutiliza o id do banco.
 */
export async function addTagToNote(input: AddTagToNoteInput) {
  const user = await requireUser()
  const data = addTagToNoteSchema.parse(input)

  await assertNoteOwner(data.noteId, user.id)

  const [existing] = await db
    .select()
    .from(tags)
    .where(and(eq(tags.userId, user.id), eq(tags.name, data.name)))
    .limit(1)

  let tagId = existing?.id

  if (!tagId) {
    await db
      .insert(tags)
      .values({ id: data.tagId, userId: user.id, name: data.name })
      .onConflictDoNothing({ target: tags.id })

    const [created] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, user.id), eq(tags.name, data.name)))
      .limit(1)

    tagId = created?.id ?? data.tagId
  }

  await db
    .insert(noteTags)
    .values({ noteId: data.noteId, tagId })
    .onConflictDoNothing()
}

export async function removeTagFromNote(input: RemoveTagFromNoteInput) {
  const user = await requireUser()
  const data = removeTagFromNoteSchema.parse(input)

  await assertNoteOwner(data.noteId, user.id)

  const [tag] = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.id, data.tagId), eq(tags.userId, user.id)))
    .limit(1)
  if (!tag) return

  await db
    .delete(noteTags)
    .where(and(eq(noteTags.noteId, data.noteId), eq(noteTags.tagId, data.tagId)))
}
