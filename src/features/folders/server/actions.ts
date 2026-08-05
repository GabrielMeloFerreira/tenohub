'use server'

import { and, count, eq, isNull, sql } from 'drizzle-orm'

import { db } from '@/server/db'
import { folders, notes } from '@/server/db/schema'
import { requireUser } from '@/server/auth'
import type { FolderWithCount } from '../types'
import {
  createFolderSchema,
  folderIdSchema,
  renameFolderSchema,
  type CreateFolderInput,
  type RenameFolderInput,
} from './schema'

export async function listFolders(): Promise<FolderWithCount[]> {
  const user = await requireUser()

  return db
    .select({
      id: folders.id,
      userId: folders.userId,
      name: folders.name,
      color: folders.color,
      position: folders.position,
      createdAt: folders.createdAt,
      deletedAt: folders.deletedAt,
      noteCount: sql<number>`count(${notes.id})`.mapWith(Number),
    })
    .from(folders)
    .leftJoin(notes, and(eq(notes.folderId, folders.id), isNull(notes.deletedAt)))
    .where(and(eq(folders.userId, user.id), isNull(folders.deletedAt)))
    .groupBy(folders.id)
    .orderBy(folders.createdAt)
}

export async function createFolder(input: CreateFolderInput) {
  const user = await requireUser()
  const data = createFolderSchema.parse(input)

  const [{ value }] = await db
    .select({ value: count() })
    .from(folders)
    .where(and(eq(folders.userId, user.id), isNull(folders.deletedAt)))

  await db
    .insert(folders)
    .values({
      id: data.id,
      userId: user.id,
      name: data.name,
      color: data.color,
      position: value,
    })
    .onConflictDoNothing({ target: folders.id })
}

export async function renameFolder(input: RenameFolderInput) {
  const user = await requireUser()
  const data = renameFolderSchema.parse(input)

  await db
    .update(folders)
    .set({ name: data.name })
    .where(and(eq(folders.id, data.id), eq(folders.userId, user.id)))
}

export async function deleteFolder(input: { id: string }) {
  const user = await requireUser()
  const { id } = folderIdSchema.parse(input)

  await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, user.id)))
}
