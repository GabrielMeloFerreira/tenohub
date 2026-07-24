import 'server-only'

import { and, desc, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/db'
import { notes } from '@/server/db/schema'
import { requireUser } from '@/server/auth'
import type { Note } from '../types'

/** Notas do usuário logado, mais recentes primeiro, sem a lixeira. */
export async function getNotes(): Promise<Note[]> {
  const user = await requireUser()

  return db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, user.id), isNull(notes.deletedAt)))
    .orderBy(desc(notes.updatedAt))
}

export async function getNote(id: string): Promise<Note | null> {
  const user = await requireUser()

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, user.id), isNull(notes.deletedAt)))
    .limit(1)

  return note ?? null
}
