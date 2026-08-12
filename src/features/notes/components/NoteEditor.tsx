'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'

import type { FolderWithCount } from '@/features/folders/types'
import type { Tag } from '@/features/tags/types'
import { editorExtensions } from '../editor-extensions'
import type { Note } from '../types'
import { countChars, countWords, ensureTitleBodyDoc, extractPlainText } from '../utils'
import NoteMetaBar from './NoteMetaBar'
import NoteStatusBar from './NoteStatusBar'
import NoteTopBar from './NoteTopBar'
import ToolBar from './ToolBar'
import '../editor.css'

interface NoteEditorProps {
  note: Note | null
  folders: FolderWithCount[]
  noteTags: Tag[]
  onChangeContent: (content: JSONContent) => void
  onMove: (folderId: string | null) => void
  onFlush: () => void
  onToggleFavorite: (isFavorite: boolean) => void
  onAddTag: (name: string) => boolean
  onRemoveTag: (tagId: string) => void
  tagSuggestions: (query: string) => Tag[]
}

export default function NoteEditor({
  note,
  folders,
  noteTags,
  onChangeContent,
  onMove,
  onFlush,
  onToggleFavorite,
  onAddTag,
  onRemoveTag,
  tagSuggestions,
}: NoteEditorProps) {
  const onChangeContentRef = useRef(onChangeContent)
  const onFlushRef = useRef(onFlush)
  useEffect(() => {
    onChangeContentRef.current = onChangeContent
    onFlushRef.current = onFlush
  }, [onChangeContent, onFlush])

  const editor = useEditor({
    extensions: editorExtensions,
    content: note ? ensureTitleBodyDoc(note.content) : '',
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
    editor.commands.setContent(ensureTitleBodyDoc(note.content), { emitUpdate: false })
  }, [editor, note])

  const stats = useMemo(() => {
    if (!note) return { words: 0, chars: 0 }
    const text = extractPlainText(note.content)
    return { words: countWords(text), chars: countChars(text) }
  }, [note])

  const handleAddTag = useCallback((name: string) => onAddTag(name), [onAddTag])
  const handleRemoveTag = useCallback((tagId: string) => onRemoveTag(tagId), [onRemoveTag])

  if (!note) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-sm text-muted-foreground">
        Selecione uma nota ou crie uma nova.
      </div>
    )
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden bg-background">
      <NoteTopBar
        title={note.title}
        folders={folders}
        folderId={note.folderId}
        isFavorite={note.isFavorite}
        onMove={onMove}
        onToggleFavorite={() => onToggleFavorite(!note.isFavorite)}
      />

      <ToolBar editor={editor} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="w-full px-3 pt-5 pb-20">
          <NoteMetaBar
            noteId={note.id}
            updatedAt={note.updatedAt}
            createdAt={note.createdAt}
            tags={noteTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            suggestionsFor={tagSuggestions}
          />
          <EditorContent editor={editor} className="text-foreground" />
        </div>
      </div>

      <NoteStatusBar wordCount={stats.words} charCount={stats.chars} />
    </div>
  )
}
