'use client'

import type { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react'

import { getButtonClass, getStatelessButtonClass } from '../styles'

interface ToolBarProps {
  editor: Editor | null
}

function Divider() {
  return <div aria-hidden="true" className="mx-1 my-1 w-px self-stretch bg-border" />
}

export default function ToolBar({ editor }: ToolBarProps) {
  if (!editor) return null

  return (
    <div className="sticky top-0 z-10 flex items-center gap-0.5 border-b border-border bg-background/95 px-4 py-1.5 backdrop-blur">
      <button
        type="button"
        title="Desfazer"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={getStatelessButtonClass()}
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        title="Refazer"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={getStatelessButtonClass()}
      >
        <Redo size={16} />
      </button>

      <Divider />

      <button
        type="button"
        title="Negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive('bold'))}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        title="Itálico"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive('italic'))}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        title="Sublinhado"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass(editor.isActive('underline'))}
      >
        <Underline size={16} />
      </button>
      <button
        type="button"
        title="Tachado"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={getButtonClass(editor.isActive('strike'))}
      >
        <Strikethrough size={16} />
      </button>
      {/* Link precisa de popover para receber a URL — fase 5 (docs/plans/05-busca-editor.md) */}
      <button type="button" title="Link (em breve)" disabled className={getStatelessButtonClass()}>
        <Link size={16} />
      </button>

      <Divider />

      <button
        type="button"
        title="Alinhar à esquerda"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        title="Centralizar"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        title="Alinhar à direita"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
      >
        <AlignRight size={16} />
      </button>
      <button
        type="button"
        title="Justificar"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'justify' }))}
      >
        <AlignJustify size={16} />
      </button>
    </div>
  )
}
