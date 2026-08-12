'use client'

import { Clock } from 'lucide-react'

import { formatRelativePast, formatShortDate } from '../utils'

interface NoteMetaBarProps {
  updatedAt: Date | string
  createdAt: Date | string
}

export default function NoteMetaBar({ updatedAt, createdAt }: NoteMetaBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Clock size={12} className="shrink-0 opacity-70" />
        Editado {formatRelativePast(updatedAt)}
      </span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <span>Criado em {formatShortDate(createdAt)}</span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <button
        type="button"
        disabled
        title="Tags em breve"
        className="rounded-full border border-dashed border-border px-2 py-0.5 text-muted-foreground/70 opacity-70"
      >
        + adicionar tag
      </button>
    </div>
  )
}
