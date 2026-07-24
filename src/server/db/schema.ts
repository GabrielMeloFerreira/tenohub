import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import type { JSONContent } from '@tiptap/react'

/*
 * Fonte da verdade do banco. Os tipos de dominio das features derivam daqui
 * (typeof notes.$inferSelect) atraves da fachada em features/[feature]/types.ts.
 *
 * userId referencia auth.users.id (schema gerenciado pelo Supabase). Nao declaramos
 * FK no Drizzle para nao tentar gerenciar o schema auth; a integridade fica por conta
 * do RLS (auth.uid()) e do filtro por userId na camada de servidor.
 * Ver docs/plans/02-dados-auth.md secao 2.6.
 *
 * IDs nunca tem default: sao gerados no cliente (src/lib/id.ts) para permitir criacao
 * offline. Ver docs/plans/03-sync-offline.md.
 */

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    color: text('color').notNull().default('gray'),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [index('folders_user_position_idx').on(t.userId, t.position)]
)

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
    title: text('title').notNull().default(''),
    content: jsonb('content').$type<JSONContent>().notNull().default({}),
    // Texto puro extraido do content. Redundante de proposito: alimenta a busca
    // full-text (fase 5) sem precisar parsear jsonb. Preenchido ao salvar.
    plainText: text('plain_text').notNull().default(''),
    wordCount: integer('word_count').notNull().default(0),
    isPinned: boolean('is_pinned').notNull().default(false),
    isFavorite: boolean('is_favorite').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    // Listagem padrao: notas de um usuario, mais recentes primeiro, exceto lixeira.
    index('notes_user_updated_idx')
      .on(t.userId, t.updatedAt.desc())
      .where(sql`${t.deletedAt} is null`),
    index('notes_user_folder_idx')
      .on(t.userId, t.folderId)
      .where(sql`${t.deletedAt} is null`),
  ]
)

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
  },
  (t) => [uniqueIndex('tags_user_name_idx').on(t.userId, t.name)]
)

export const noteTags = pgTable(
  'note_tags',
  {
    noteId: uuid('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.noteId, t.tagId] })]
)

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    noteId: uuid('note_id').references(() => notes.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    isDone: boolean('is_done').notNull().default(false),
    dueAt: timestamp('due_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [index('tasks_user_idx').on(t.userId)]
)

/*
 * Agnostica ao gateway de proposito. externalId + provider guardam a referencia de
 * quem processa o pagamento; a decisao Stripe vs MoR (fase 6) nao forca migracao.
 */
export const subscriptions = pgTable('subscriptions', {
  userId: uuid('user_id').primaryKey(),
  status: text('status').notNull().default('inactive'),
  plan: text('plan').notNull().default('free'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  provider: text('provider'),
  externalId: text('external_id'),
})
