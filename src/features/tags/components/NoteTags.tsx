'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Tag } from '../types'

interface NoteTagsProps {
  noteId: string
  tags: Tag[]
  suggestions: Tag[]
  onAdd: (name: string) => boolean
  onRemove: (tagId: string) => void
  onQueryChange: (query: string) => void
}

export default function NoteTags({
  noteId,
  tags,
  suggestions,
  onAdd,
  onRemove,
  onQueryChange,
}: NoteTagsProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  // Ao trocar de nota, fecha o input.
  useEffect(() => {
    setOpen(false)
    setValue('')
    onQueryChange('')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só reage a noteId
  }, [noteId])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function commit(name: string) {
    const ok = onAdd(name)
    if (ok) {
      setValue('')
      onQueryChange('')
      setActiveIndex(0)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const options =
      value.trim() && !suggestions.some((s) => s.name.toLowerCase() === value.trim().toLowerCase())
        ? [...suggestions.map((s) => s.name), value.trim()]
        : suggestions.map((s) => s.name)

    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      setValue('')
      onQueryChange('')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(options.length - 1, 0)))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const pick = options[activeIndex] ?? value
      if (pick.trim()) commit(pick)
    }
  }

  const showCreate =
    value.trim().length > 0 &&
    !suggestions.some((s) => s.name.toLowerCase() === value.trim().replace(/^#/, '').toLowerCase())

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={cn(
            'group inline-flex items-center gap-0.5 rounded-full border border-border/80',
            'bg-muted/60 px-2 py-0.5 text-xs font-medium text-primary'
          )}
        >
          <span>#{tag.name}</span>
          <button
            type="button"
            title={`Remover #${tag.name}`}
            onClick={() => onRemove(tag.id)}
            className="rounded-full p-0.5 text-muted-foreground opacity-60 transition-opacity hover:bg-background/50 hover:text-foreground hover:opacity-100"
          >
            <X size={11} />
          </button>
        </span>
      ))}

      {open ? (
        <div className="relative inline-flex">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              onQueryChange(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // Delay para permitir click na sugestão.
              window.setTimeout(() => {
                setOpen(false)
                setValue('')
                onQueryChange('')
              }, 150)
            }}
            placeholder="nome da tag"
            aria-autocomplete="list"
            aria-controls={listId}
            className={cn(
              'h-6 w-28 rounded-full border border-border bg-background px-2',
              'text-xs text-foreground outline-none placeholder:text-muted-foreground/50',
              'focus-visible:border-ring'
            )}
          />

          {(suggestions.length > 0 || showCreate) && (
            <ul
              id={listId}
              role="listbox"
              className={cn(
                'absolute top-full left-0 z-30 mt-1 min-w-[10rem] overflow-hidden rounded-md',
                'border border-border bg-popover py-1 text-xs text-popover-foreground shadow-md'
              )}
            >
              {suggestions.map((s, i) => (
                <li key={s.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full px-2.5 py-1.5 text-left hover:bg-muted',
                      i === activeIndex && 'bg-muted'
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(s.name)}
                  >
                    #{s.name}
                  </button>
                </li>
              ))}
              {showCreate && (
                <li role="option" aria-selected={activeIndex === suggestions.length}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full px-2.5 py-1.5 text-left text-primary hover:bg-muted',
                      activeIndex === suggestions.length && 'bg-muted'
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(value)}
                  >
                    Criar #{value.trim().replace(/^#/, '')}
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'rounded-full border border-dashed border-border px-2 py-0.5',
            'text-xs text-muted-foreground transition-colors',
            'hover:border-muted-foreground/50 hover:text-foreground'
          )}
        >
          + adicionar tag
        </button>
      )}
    </div>
  )
}
