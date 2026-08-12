'use client'

import { Bell, MoreHorizontal, Share2, Star } from 'lucide-react'

import FolderPicker from '@/features/folders/components/FolderPicker'
import type { FolderWithCount } from '@/features/folders/types'
import { cn } from '@/lib/utils'
import { getStatelessButtonClass } from '../styles'

interface NoteTopBarProps {
  title: string
  folders: FolderWithCount[]
  folderId: string | null
  isFavorite: boolean
  onMove: (folderId: string | null) => void
  onToggleFavorite: () => void
}

export default function NoteTopBar({
  title,
  folders,
  folderId,
  isFavorite,
  onMove,
  onToggleFavorite,
}: NoteTopBarProps) {
  const displayTitle = title.trim() || 'Sem título'

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3 py-2">
      <nav
        aria-label="Local da nota"
        className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
      >
        <FolderPicker folders={folders} value={folderId} onChange={onMove} variant="breadcrumb" />
        <span aria-hidden="true" className="shrink-0 text-muted-foreground/60">
          ›
        </span>
        <span className="truncate font-medium text-foreground" title={displayTitle}>
          {displayTitle}
        </span>
      </nav>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          title="Notificações (em breve)"
          disabled
          className={getStatelessButtonClass()}
        >
          <Bell size={16} />
        </button>
        <button
          type="button"
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
          onClick={onToggleFavorite}
          className={cn(
            getStatelessButtonClass(),
            isFavorite && 'text-amber-400 hover:text-amber-300'
          )}
        >
          <Star size={16} className={isFavorite ? 'fill-current' : undefined} />
        </button>
        <button
          type="button"
          title="Mais opções (em breve)"
          disabled
          className={getStatelessButtonClass()}
        >
          <MoreHorizontal size={16} />
        </button>
        <button
          type="button"
          title="Compartilhar (em breve)"
          disabled
          className={cn(
            'ml-1 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1',
            'text-xs font-medium text-muted-foreground',
            'opacity-60'
          )}
        >
          <Share2 size={13} />
          Compartilhar
        </button>
      </div>
    </header>
  )
}
