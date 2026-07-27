'use client'

import { useCallback } from 'react'
import type { JSONContent } from '@tiptap/react'

import NavSidebar from '@/components/layout/NavSidebar'
import { useUiStore } from '@/stores/ui-store'
import { useNotes } from '../hooks/useNotes'
import type { Note } from '../types'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'
import SyncStatus from './SyncStatus'

interface NotesWorkspaceProps {
  initialNotes: Note[]
  user: { name: string; email: string }
}

export default function NotesWorkspace({ initialNotes, user }: NotesWorkspaceProps) {
  const { notes, createNote, updateNote, flushNote } = useNotes(initialNotes)

  const view = useUiStore((s) => s.view)
  const selectedNoteId = useUiStore((s) => s.selectedNoteId)
  const setView = useUiStore((s) => s.setView)
  const selectNote = useUiStore((s) => s.selectNote)

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null

  // Ao trocar de nota, persiste a anterior na hora — não deixa edição pendente no debounce.
  const handleSelectNote = useCallback(
    (id: string) => {
      flushNote(selectedNoteId)
      selectNote(id)
    },
    [flushNote, selectedNoteId, selectNote]
  )

  const handleCreateNote = useCallback(() => {
    flushNote(selectedNoteId)
    const note = createNote()
    selectNote(note.id)
    setView('notes')
  }, [flushNote, selectedNoteId, createNote, selectNote, setView])

  const handleFlush = useCallback(() => flushNote(selectedNoteId), [flushNote, selectedNoteId])

  const handleChangeTitle = useCallback(
    (title: string) => {
      if (selectedNoteId) updateNote(selectedNoteId, { title })
    },
    [selectedNoteId, updateNote]
  )

  const handleChangeContent = useCallback(
    (content: JSONContent) => {
      if (selectedNoteId) updateNote(selectedNoteId, { content })
    },
    [selectedNoteId, updateNote]
  )

  return (
    <>
      <NavSidebar
        view={view}
        user={user}
        onChangeView={setView}
        onCreateNote={handleCreateNote}
      />

      {view === 'notes' ? (
        <div className="relative flex min-w-0 flex-1 overflow-hidden">
          <NoteList
            notes={notes}
            selectedId={selectedNoteId}
            username={user.name}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
          />
          <NoteEditor
            note={selectedNote}
            onChangeTitle={handleChangeTitle}
            onChangeContent={handleChangeContent}
            onFlush={handleFlush}
          />
          <SyncStatus />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Em breve.
        </div>
      )}
    </>
  )
}
