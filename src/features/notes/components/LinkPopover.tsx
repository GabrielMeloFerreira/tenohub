'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Link as LinkIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getButtonClass } from '../styles'

export default function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  function handleOpenChange(next: boolean) {
    if (next) setUrl((editor.getAttributes('link').href as string | undefined) ?? '')
    setOpen(next)
  }

  function apply() {
    const value = url.trim()
    if (value) editor.chain().focus().setLink({ href: value }).run()
    else editor.chain().focus().unsetLink().run()
    setOpen(false)
  }

  function remove() {
    editor.chain().focus().unsetLink().run()
    setOpen(false)
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
      <PopoverContent>
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
