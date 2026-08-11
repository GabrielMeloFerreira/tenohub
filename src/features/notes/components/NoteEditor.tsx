'use client'

import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'

import FolderPicker from '@/features/folders/components/FolderPicker'
import { editorExtensions } from '../editor-extensions'
import type { FolderWithCount } from '@/features/folders/types'
import type { Note } from '../types'
import ToolBar from './ToolBar'
import '../editor.css'

interface NoteEditorProps {
  note: Note | null
  folders: FolderWithCount[]
  onChangeContent: (content: JSONContent) => void
  onMove: (folderId: string | null) => void
  onFlush: () => void
}

export default function NoteEditor({
  note,
  folders,
  onChangeContent,
  onMove,
  onFlush,
}: NoteEditorProps) {
  const onChangeContentRef = useRef(onChangeContent)
  const onFlushRef = useRef(onFlush)
  useEffect(() => {
    onChangeContentRef.current = onChangeContent
    onFlushRef.current = onFlush
  }, [onChangeContent, onFlush])

  const editor = useEditor({
    extensions: editorExtensions,
    content: note?.content ?? '',
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChangeContentRef.current(editor.getJSON()),
    onBlur: () => onFlushRef.current(),
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
        <FolderPicker folders={folders} value={note.folderId} onChange={onMove} />
      </header>

      <ToolBar editor={editor} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full px-4 py-4 text-foreground" />
      </div>
    </div>
  )
}
