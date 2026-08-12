'use client'

import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { FolderWithCount } from '../types'

interface FolderPickerProps {
  folders: FolderWithCount[]
  value: string | null
  onChange: (folderId: string | null) => void
  /** `breadcrumb` = estilo da top bar do editor; `default` = select com borda. */
  variant?: 'default' | 'breadcrumb'
}

export default function FolderPicker({
  folders,
  value,
  onChange,
  variant = 'default',
}: FolderPickerProps) {
  if (variant === 'breadcrumb') {
    return (
      <label className="relative inline-flex min-w-0 max-w-[10rem] items-center">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className={cn(
            'max-w-full cursor-pointer appearance-none truncate bg-transparent py-0.5 pr-5 pl-0',
            'text-sm text-muted-foreground outline-none',
            'hover:text-foreground focus-visible:text-foreground'
          )}
          aria-label="Pasta da nota"
        >
          <option value="">Sem pasta</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/70"
        />
      </label>
    )
  }

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
      aria-label="Pasta da nota"
    >
      <option value="">Sem pasta</option>
      {folders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))}
    </select>
  )
}
