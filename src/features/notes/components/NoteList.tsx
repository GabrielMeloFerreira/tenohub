'use client'

import { Plus } from 'lucide-react'

import type { Note } from '../types'
import NoteCard from './NoteCard'

interface NoteListProps {
  notes: Note[]
  selectedId: string | null
  username: string
  onSelectNote: (id: string) => void
  onCreateNote: () => void
}

export default function NoteList({
  notes,
  selectedId,
  username,
  onSelectNote,
  onCreateNote,
}: NoteListProps) {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r border-border">
      <header className="flex shrink-0 items-start justify-between gap-2 p-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-foreground">
            Notas de {username}
          </h2>
          <p className="text-xs text-muted-foreground">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNote}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          Nova
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-4">
        {notes.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Nenhuma nota ainda.
          </p>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onSelect={onSelectNote}
            />
          ))
        )}
      </main>
    </div>
  )
}
