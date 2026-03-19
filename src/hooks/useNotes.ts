import { useState } from "react"
import { Note } from "@/types"
import { mockNotes } from "@/data/mockNotes"

type View = 'notes' | 'todo' | 'calendar' | 'settings'

export function useNotes () {
  const [ view, setView ] = useState<View>('notes');
  const [ notes, setNotes ] = useState<Note[]>(mockNotes);
  const [ selectedId, setSelectedId ] = useState<string | null>(null);

  const selectedNote = notes.find((note) => note.id === selectedId) ?? null

  function handleNewNote() {
    const newNote: Note = {
        id: crypto.randomUUID(),
        title: 'Nova nota',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
    }
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  }

  function handleSelectNote(id: string) {
    setSelectedId(id);
  }

  function handleDeleteNote(id: string) {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleUpdateNote(updatedNote: Note) {
    setNotes(notes.map((note) => note.id === updatedNote.id ? updatedNote : note))
  }

  return {
    view,
    setView,
    notes,
    selectedId,
    selectedNote,
    handleNewNote,
    handleSelectNote,
    handleDeleteNote,
    handleUpdateNote
  }
}