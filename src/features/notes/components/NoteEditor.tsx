'use client'

import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'

import type { Note } from '../types'
import ToolBar from './ToolBar'
import '../editor.css'

interface NoteEditorProps {
  note: Note | null
  onChangeTitle: (title: string) => void
  onChangeContent: (content: JSONContent) => void
}

export default function NoteEditor({ note, onChangeTitle, onChangeContent }: NoteEditorProps) {
  // Mantém o callback fresco sem recriar o editor a cada render do pai.
  const onChangeContentRef = useRef(onChangeContent)
  useEffect(() => {
    onChangeContentRef.current = onChangeContent
  }, [onChangeContent])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: note?.content ?? '',
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChangeContentRef.current(editor.getJSON()),
  })

  // Recarrega o documento apenas quando troca a nota selecionada. Sem o guard por id,
  // cada keystroke voltaria ao editor e o cursor pularia para o fim.
  const loadedNoteId = useRef<string | null>(null)
  useEffect(() => {
    if (!editor || !note) return
    if (loadedNoteId.current === note.id) return

    loadedNoteId.current = note.id
    editor.commands.setContent(note.content, { emitUpdate: false })
  }, [editor, note])

  if (!note) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-sm text-muted-foreground">
        Selecione uma nota ou crie uma nova.
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="shrink-0 px-4 pt-4">
        <div className="text-xs text-muted-foreground">Caminho</div>

        <input
          value={note.title}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Título da página"
          className="mt-2 w-full bg-transparent text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
        />

        <button
          type="button"
          className="mt-2 mb-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          + Adicionar tag
        </button>
      </header>

      <ToolBar editor={editor} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full px-4 py-4 text-foreground" />
      </div>
    </div>
  )
}
