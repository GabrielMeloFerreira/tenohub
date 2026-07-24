import type { notes } from '@/server/db/schema'

/**
 * Fachada do schema do Drizzle. Os componentes importam `Note` daqui, nunca de
 * `@/server/db` — é `import type`, então some no build, mas manter a fachada evita que
 * alguém troque por um import de valor e arraste código de servidor para o bundle.
 */
export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
