'use client'

import { useSideBar } from "@/hooks/useSideBar"

import Sidebar from "@/components/Sidebar/NavSidebar"
import MyNotes from "@/components/SideNotes/SideNotes"
import NoteEditor from "@/components/NoteEditor/NoteEditor"
import { Group, Panel, Separator } from "react-resizable-panels"

export default function Home() {

  const { view, handleClickNewNote, handleClickView } = useSideBar()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        view={view}
        handleClick={handleClickView}
        onSelectNewNote={handleClickNewNote} />

      {view === 'notes' && (
        <div className='flex flex-1 overflow-hidden'>
          <MyNotes
            username={'Gabriel de Melo Ferreira'} />
          <NoteEditor />
        </div>
      )}
    </div>
  )

}