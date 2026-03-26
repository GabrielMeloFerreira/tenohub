import { Note } from "@/types"

interface NoteModalProps {
    notes: Note[]
    selectedId: string | null
    onSelectNote: (id: string) => void
}

export default function NoteModal({ notes, selectedId, onSelectNote}: NoteModalProps) {
    return (
        <div className='flex flex-col flex-1 min-w-40 min-h-45 rounded-[10px] bg-notes-base'>
            <header className='text-white mt-2 ml-2'>
                Title
            </header>
            <main className='text-white ml-2'>
                Note Text
            </main>
        </div>
    ) 
}