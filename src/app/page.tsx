'use client'

import { useSideBar } from "@/hooks/useSideBar"

import Sidebar from "@/components/layout/Sidebar"
import MyNotes from "@/components/layout/MyNotes"

export default function Home () {

  const {view, handleClickNewNote, handleClickView} = useSideBar()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        view={view}
        handleClick={handleClickView}
        onSelectNewNote={handleClickNewNote}
      />

      {view === 'notes' && (
        <>
          <MyNotes
            username={'Gabriel de Melo Ferreira'}
          />
        </>
      )}
    </div>
  )

}