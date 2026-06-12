import { Note } from "@/types"
import { use, useEffect, useRef, useState } from "react"
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn } from "@/utils/cn";
import invariant from 'tiny-invariant';


interface NoteModalProps {
    notes: Note[]
    selectedId: string | null
    onSelectNote: (id: string) => void
}

export default function NoteModal({ notes, selectedId, onSelectNote}: NoteModalProps) {

    const ref = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    
    
    useEffect(() => {
        const el = ref.current;
        invariant(el);
        if (!el) return;

        return draggable({ 
            element: el,
            onDragStart: () => setDragging(true),
            onDrop: () => setDragging(false)
        });
    }, [notes, selectedId, onSelectNote]);
    console.log("a",dragging);
    

    return (
        <div ref={ref} className={cn('flex flex-col flex-1 min-w-40 min-h-45 rounded-[10px] bg-notes-base hover:bg-notes-hover', {'opacity-50': dragging})}>
            <header className='text-white mt-2 ml-2'>
                Title
            </header>
            <main className='text-white ml-2'>
                Note Text
            </main>
        </div>
    ) 
}