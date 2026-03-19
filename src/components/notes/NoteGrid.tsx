import { Note } from "@/types"

interface NoteGridProps {
    notes: Note[]
    selectedId: string | null
    onSelectNote: (id: string) => void
}

export default function NoteGrid({ notes, selectedId, onSelectNote}: NoteGridProps) {
    return (
        <div className='flex-1 bg-bg-surface'>
            NoteGrid
        </div>
    )
}