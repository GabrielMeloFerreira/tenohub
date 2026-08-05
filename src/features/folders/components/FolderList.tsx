'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { FOLDER_COLORS, colorClass, type FolderColor } from '../colors'
import type { FolderWithCount } from '../types'

interface FolderListProps {
  folders: FolderWithCount[]
  onCreate: (name: string, color: FolderColor) => string
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export default function FolderList({ folders, onCreate, onRename, onDelete }: FolderListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  function startRename(id: string, name: string) {
    setRenamingId(id)
    setDraft(name)
  }

  function commitRename() {
    if (renamingId && draft.trim()) onRename(renamingId, draft.trim())
    setRenamingId(null)
  }

  function handleCreate() {
    const color = FOLDER_COLORS[folders.length % FOLDER_COLORS.length]
    const id = onCreate('Nova pasta', color)
    startRename(id, 'Nova pasta')
  }

  function handleDelete(id: string) {
    if (confirm('Excluir a pasta? As notas nao serao apagadas.')) onDelete(id)
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">Pastas</span>
        <button
          type="button"
          onClick={handleCreate}
          title="Nova pasta"
          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus size={14} />
        </button>
      </div>

      {folders.length === 0 && (
        <p className="px-2 py-1 text-xs text-muted-foreground">Nenhuma pasta ainda.</p>
      )}

      {folders.map((folder) => (
        <div
          key={folder.id}
          className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
        >
          <span className={cn('size-2 shrink-0 rounded-full', colorClass(folder.color))} />

          {renamingId === folder.id ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setRenamingId(null)
              }}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
            />
          ) : (
            <button
              type="button"
              onDoubleClick={() => startRename(folder.id, folder.name)}
              className="min-w-0 flex-1 truncate text-left text-foreground"
            >
              {folder.name}
            </button>
          )}

          <span className="text-xs text-muted-foreground">{folder.noteCount}</span>

          <button
            type="button"
            onClick={() => handleDelete(folder.id)}
            title="Excluir pasta"
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
