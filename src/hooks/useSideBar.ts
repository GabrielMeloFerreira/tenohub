import { Note } from "@/types";
import { useState } from "react"
import { mockNotes } from "@/data/mockNotes";


export function useSideBar () {
    const [ notes, setNotes ] = useState<Note[]>(mockNotes);
    const [ selectedId, setSelectedId ] = useState<string | null>(null);

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
    }

    function handleClickMyNotes () {
        
    }
    function handleClickTodo () {
        
    }
    function handleClickCalendar () {
        
    }

    return {
        handleClickNewNote,
        handleClickMyNotes,
        handleClickTodo,
        handleClickCalendar
    }

}