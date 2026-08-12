'use client'

import { useMemo, useState } from 'react'
import { Clock } from 'lucide-react'

import NoteTags from '@/features/tags/components/NoteTags'
import type { Tag } from '@/features/tags/types'
import { formatRelativePast, formatShortDate } from '../utils'

interface NoteMetaBarProps {
  noteId: string
  updatedAt: Date | string
  createdAt: Date | string
  tags: Tag[]
  onAddTag: (name: string) => boolean
  onRemoveTag: (tagId: string) => void
  suggestionsFor: (query: string) => Tag[]
}

export default function NoteMetaBar({
  noteId,
  updatedAt,
  createdAt,
  tags,
  onAddTag,
  onRemoveTag,
  suggestionsFor,
}: NoteMetaBarProps) {
  const [query, setQuery] = useState('')
  const suggestions = useMemo(() => suggestionsFor(query), [suggestionsFor, query])

  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Clock size={12} className="shrink-0 opacity-70" />
        Editado {formatRelativePast(updatedAt)}
      </span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <span>Criado em {formatShortDate(createdAt)}</span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <NoteTags
        noteId={noteId}
        tags={tags}
        suggestions={suggestions}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
        onQueryChange={setQuery}
      />
    </div>
  )
}
