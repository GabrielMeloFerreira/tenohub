import Link from "next/link";
import { Note } from "@/types";

interface SidebarProps {
    notes: Note[]
    selectedId: string | null
    onSelectNote: ( id: string ) => void
    onNewNote: () => void
}

export default function Sidebar({ notes, selectedId, onSelectNote, onNewNote }: SidebarProps) {
    return (
        <>
            <div>
                <span>Usuario</span>
            </div>

            <nav>
                <button onClick={onNewNote}>Nova nota</button>
            </nav>
        </>
    )
}