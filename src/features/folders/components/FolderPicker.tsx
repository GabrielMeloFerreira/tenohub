'use client'

import type { FolderWithCount } from '../types'

interface FolderPickerProps {
  folders: FolderWithCount[]
  value: string | null
  onChange: (folderId: string | null) => void
}

export default function FolderPicker({ folders, value, onChange }: FolderPickerProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
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
