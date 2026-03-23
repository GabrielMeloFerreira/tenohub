'use client'

import { useSideBar } from "@/hooks/useSideBar"

import Sidebar from "@/components/layout/Sidebar"
import NoteGrid from "@/components/notes/NoteGrid"
import NoteEditor from "@/components/notes/NoteEditor"

type View = 'notes' | 'todo' | 'calendar' | 'settings' | 'user'

export default function Home () {

  const {view, handleClickNewNote, handleClickView} = useSideBar()

  return (
    <div>
      <Sidebar
        view={view}
        handleClick={handleClickView}
        onSelectNewNote={handleClickNewNote}
      />

      {/* {view === 'notes' && (
        <>
          <NoteGrid
            notes={notes}
            selectedId={selectedId}
            onSelectNote={handleSelectNote}
          />
        </>
      )} */}
    </div>
  )

}