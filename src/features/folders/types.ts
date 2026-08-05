import type { folders } from '@/server/db/schema'

export type Folder = typeof folders.$inferSelect

export type FolderWithCount = Folder & { noteCount: number }
