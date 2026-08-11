'use client'

import type { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Highlighter,
  Italic,
  Lightbulb,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Quote,
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

const blockOptions = [
  { value: 'paragraph', label: 'Texto' },
  { value: 'h1', label: 'Titulo 1' },
  { value: 'h2', label: 'Titulo 2' },
  { value: 'h3', label: 'Titulo 3' },
]

export default function ToolBar({ editor }: ToolBarProps) {
  if (!editor) return null

  const currentBlock = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph'

  function setBlock(value: string) {
    const chain = editor!.chain().focus()
    if (value === 'paragraph') chain.setParagraph().run()
    else chain.toggleHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run()
  }

  function setLink() {
    const prev = editor!.getAttributes('link').href as string | undefined
    const url = window.prompt('URL do link', prev ?? '')
    if (url === null) return
    if (url === '') {
      editor!.chain().focus().unsetLink().run()
      return
    }
    editor!.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-border bg-background/95 px-4 py-1.5 backdrop-blur">
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

      <select
        value={currentBlock}
        onChange={(e) => setBlock(e.target.value)}
        className="rounded bg-transparent px-1.5 py-1 text-sm text-foreground outline-none hover:bg-muted"
      >
        {blockOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

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
        title="Italico"
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
      <button
        type="button"
        title="Marca-texto"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={getButtonClass(editor.isActive('highlight'))}
      >
        <Highlighter size={16} />
      </button>
      <button
        type="button"
        title="Link"
        onClick={setLink}
        className={getButtonClass(editor.isActive('link'))}
      >
        <LinkIcon size={16} />
      </button>

      <Divider />

      <button
        type="button"
        title="Lista com marcador"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive('bulletList'))}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        title="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive('orderedList'))}
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        title="Checklist"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={getButtonClass(editor.isActive('taskList'))}
      >
        <ListChecks size={16} />
      </button>
      <button
        type="button"
        title="Citacao"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={getButtonClass(editor.isActive('blockquote'))}
      >
        <Quote size={16} />
      </button>
      <button
        type="button"
        title="Bloco de codigo"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={getButtonClass(editor.isActive('codeBlock'))}
      >
        <Code size={16} />
      </button>
      <button
        type="button"
        title="Destaque (callout)"
        onClick={() => editor.chain().focus().toggleWrap('callout').run()}
        className={getButtonClass(editor.isActive('callout'))}
      >
        <Lightbulb size={16} />
      </button>

      <Divider />

      <button
        type="button"
        title="Alinhar a esquerda"
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
        title="Alinhar a direita"
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
