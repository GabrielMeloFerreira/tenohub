import { Note } from "@/types";
import { View } from "@/types/sideBar";
import { useState } from "react"
import { mockNotes } from "@/data/mockNotes";

export function useSideBar () {
    const [ notes, setNotes ] = useState<Note[]>(mockNotes);
    const [ selectedId, setSelectedId ] = useState<string | null>(null);
    const [ view, setView ] = useState<View>('notes')

    function handleClickNewNote () {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'Nova nota',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setNotes([newNote, ...notes]);
        setSelectedId(newNote.id);
        console.log(newNote)
        console.log(selectedId)
    }

    function handleClickView (view: View) {
        setView(view);
    }

    return {
        handleClickNewNote,
        handleClickView,
        view
    }

}