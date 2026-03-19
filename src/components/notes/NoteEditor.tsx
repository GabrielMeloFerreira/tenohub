import { Note } from "@/types"

interface NoteEditorProps {
    note: Note | null
    onUpdate: (note: Note) => void
    onDelete: (id: string) => void
}

export default function NoteEditor({ note, onUpdate, onDelete}: NoteEditorProps) {
    return (
        <div className='flex-1 bg-bg-elevated'>
            NoteEditor
        </div>
    )
}