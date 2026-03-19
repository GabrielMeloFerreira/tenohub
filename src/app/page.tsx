'use client'

import { useNotes } from '@/hooks/useNotes'
import Sidebar from "@/components/layout/Sidebar"
import NoteGrid from "@/components/notes/NoteGrid"
import NoteEditor from "@/components/notes/NoteEditor"

type View = 'notes' | 'todo' | 'calendar' | 'settings'

export default function Home () {

  const { view, notes, selectedId, selectedNote, handleNewNote, handleSelectNote, handleDeleteNote, handleUpdateNote, setView } = useNotes();

  return (
    <div>
      <Sidebar
        view={view}
        onSelectView={setView}
        onSelectNewNote={handleNewNote}
      />

      {view === 'notes' && (
        <>
          <NoteGrid
            notes={notes}
            selectedId={selectedId}
            onSelectNote={handleSelectNote}
          />
        </>
      )}
    </div>
  )

}