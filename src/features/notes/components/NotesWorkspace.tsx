'use client'

import { useCallback } from 'react'
import type { JSONContent } from '@tiptap/react'

import NavSidebar from '@/components/layout/NavSidebar'
import { useUiStore } from '@/stores/ui-store'
import { useNotes } from '../hooks/useNotes'
import type { Note } from '../types'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'

interface NotesWorkspaceProps {
  initialNotes: Note[]
  user: { name: string; email: string }
}

export default function NotesWorkspace({ initialNotes, user }: NotesWorkspaceProps) {
  const { notes, createNote, updateNote } = useNotes(initialNotes)

  const view = useUiStore((s) => s.view)
  const selectedNoteId = useUiStore((s) => s.selectedNoteId)
  const setView = useUiStore((s) => s.setView)
  const selectNote = useUiStore((s) => s.selectNote)

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null

  const handleCreateNote = useCallback(() => {
    const note = createNote()
    selectNote(note.id)
    setView('notes')
  }, [createNote, selectNote, setView])

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
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <NoteList
            notes={notes}
            selectedId={selectedNoteId}
            username={user.name}
            onSelectNote={selectNote}
            onCreateNote={handleCreateNote}
          />
          <NoteEditor
            note={selectedNote}
            onChangeTitle={handleChangeTitle}
            onChangeContent={handleChangeContent}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Em breve.
        </div>
      )}
    </>
  )
}
