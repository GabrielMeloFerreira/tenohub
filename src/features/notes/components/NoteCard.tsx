'use client'

import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

import { cn } from '@/lib/utils'
import type { Note } from '../types'
import { previewFromDoc } from '../utils'

interface NoteCardProps {
  note: Note
  isSelected: boolean
  onSelect: (id: string) => void
}

export default function NoteCard({ note, isSelected, onSelect }: NoteCardProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ type: 'note', noteId: note.id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [note.id])

  const preview = previewFromDoc(note.content)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(note.id)}
      className={cn(
        'flex w-full flex-col gap-1 rounded-[10px] border border-transparent bg-card p-3 text-left transition-colors hover:bg-muted',
        isSelected && 'border-primary bg-muted',
        dragging && 'opacity-50'
      )}
    >
      <span className="truncate text-sm font-medium text-foreground">
        {note.title || 'Sem título'}
      </span>
      <span className="line-clamp-2 text-xs text-muted-foreground">
        {preview || 'Nota vazia'}
      </span>
    </button>
  )
}
