'use client'

import { useCallback } from 'react'
import type { JSONContent } from '@tiptap/react'

import NavSidebar from '@/components/layout/NavSidebar'
import NoteEditor from '@/features/notes/components/NoteEditor'
import NoteList from '@/features/notes/components/NoteList'
import { useNotes } from '@/features/notes/hooks/useNotes'
import { useUiStore } from '@/stores/ui-store'

export default function Home() {
  const { notes, createNote, updateNote } = useNotes()

  const view = useUiStore((state) => state.view)
  const selectedNoteId = useUiStore((state) => state.selectedNoteId)
  const setView = useUiStore((state) => state.setView)
  const selectNote = useUiStore((state) => state.selectNote)

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

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
      <NavSidebar view={view} onChangeView={setView} onCreateNote={handleCreateNote} />

      {view === 'notes' ? (
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <NoteList
            notes={notes}
            selectedId={selectedNoteId}
            username="Gabriel"
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
