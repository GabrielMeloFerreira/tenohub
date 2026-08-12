'use client'

import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Link as LinkIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getButtonClass } from '../styles'
import { selectionHighlightKey } from '../extensions/selection-highlight'

export default function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const anchorRect = useRef<DOMRect | null>(null)

  const anchor = { getBoundingClientRect: () => anchorRect.current ?? new DOMRect() }

  function highlight(active: boolean) {
    const { from, to } = editor.state.selection
    editor.view.dispatch(
      editor.state.tr.setMeta(selectionHighlightKey, active ? { from, to } : null)
    )
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      const { from, to } = editor.state.selection
      const start = editor.view.coordsAtPos(from)
      const end = editor.view.coordsAtPos(to)
      const left = Math.min(start.left, end.left)
      const right = Math.max(start.right, end.right)
      const top = Math.min(start.top, end.top)
      const bottom = Math.max(start.bottom, end.bottom)
      anchorRect.current = new DOMRect(left, top, right - left, bottom - top)
      setUrl((editor.getAttributes('link').href as string | undefined) ?? '')
      highlight(true)
    } else {
      highlight(false)
    }
    setOpen(next)
  }

  function apply() {
    const value = url.trim()
    if (value) editor.chain().focus().setLink({ href: value }).run()
    else editor.chain().focus().unsetLink().run()
    handleOpenChange(false)
  }

  function remove() {
    editor.chain().focus().unsetLink().run()
    handleOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        title="Link"
        className={getButtonClass(editor.isActive('link'))}
      >
        <LinkIcon size={16} />
      </PopoverTrigger>
      <PopoverContent anchor={anchor} side="bottom" align="center">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            apply()
          }}
          className="flex flex-col gap-2"
        >
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:border-ring"
          />
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={remove}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remover
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Aplicar
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
