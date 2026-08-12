'use client'

import { useIsMutating } from '@tanstack/react-query'
import { CloudOff, Maximize2, RefreshCw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useOnlineStatus } from '@/lib/use-online-status'
import { formatCount } from '../utils'
import { getStatelessButtonClass } from '../styles'

interface NoteStatusBarProps {
  wordCount: number
  charCount: number
}

export default function NoteStatusBar({ wordCount, charCount }: NoteStatusBarProps) {
  const pending = useIsMutating()
  const online = useOnlineStatus()

  let label = 'Sincronizado'
  let tone = 'text-muted-foreground'
  let dot = 'bg-emerald-500'
  let StatusIcon: typeof RefreshCw | null = null

  if (!online) {
    StatusIcon = CloudOff
    label = pending > 0 ? `Offline · ${pending} pendente${pending > 1 ? 's' : ''}` : 'Offline'
    tone = 'text-amber-500'
    dot = 'bg-amber-500'
  } else if (pending > 0) {
    StatusIcon = RefreshCw
    label = 'Salvando…'
    tone = 'text-blue-400'
    dot = 'bg-blue-400'
  }

  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
      <div className={cn('inline-flex items-center gap-1.5', tone)}>
        <span className={cn('size-1.5 shrink-0 rounded-full', dot)} />
        {StatusIcon ? (
          <StatusIcon size={12} className={cn(online && pending > 0 && 'animate-spin')} />
        ) : null}
        <span>{label}</span>
      </div>

      <div className="inline-flex items-center gap-2">
        <span>
          {formatCount(wordCount)} {wordCount === 1 ? 'palavra' : 'palavras'}
          <span className="mx-1.5 text-border">·</span>
          {formatCount(charCount)} {charCount === 1 ? 'caractere' : 'caracteres'}
        </span>
        <button
          type="button"
          title="Modo foco (em breve)"
          disabled
          className={cn(getStatelessButtonClass(), 'opacity-50')}
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </footer>
  )
}
