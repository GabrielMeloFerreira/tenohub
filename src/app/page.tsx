'use client'

import { useState } from "react"
import { Note } from "@/types"
import { mockNotes } from "@/data/mockNotes"
import Sidebar from "@/components/layout/Sidebar"
import NoteGrid from "@/components/notes/NoteGrid"
import NoteEditor from "@/components/notes/NoteEditor"

type View = 'notes' | 'todo' | 'calendar' | 'settings'

export default function Home () {
  const [ view, setView ] = useState<View>('notes');
  const [ notes, setNotes ] = useState<Note[]>(mockNotes);
  const [ selectedId, setSelectedId ] = useState<string | null>(null);

  const selectNote = notes.find((note) => note.id === selectedId) ?? null
}