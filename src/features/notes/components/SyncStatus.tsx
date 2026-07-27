'use client'

import { useIsMutating } from '@tanstack/react-query'
import { Check, CloudOff, RefreshCw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useOnlineStatus } from '@/lib/use-online-status'

/**
 * Indicador de sincronização (canto inferior direito, como no mockup).
 *
 * Sem ele o usuário não sabe se pode fechar a aba — é o que transforma "parece que
 * salvou" em confiança. Ver docs/plans/03-sync-offline.md secao 3.6.
 */
export default function SyncStatus() {
  const pending = useIsMutating()
  const online = useOnlineStatus()

  let Icon = Check
  let label = 'Sincronizado'
  let tone = 'text-muted-foreground'

  if (!online) {
    Icon = CloudOff
    label = pending > 0 ? `Offline · ${pending} pendente${pending > 1 ? 's' : ''}` : 'Offline'
    tone = 'text-amber-500'
  } else if (pending > 0) {
    Icon = RefreshCw
    label = 'Salvando…'
    tone = 'text-blue-400'
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-3 right-4 z-20 inline-flex items-center gap-1.5',
        'rounded-full border border-border bg-background/90 px-2.5 py-1 text-xs backdrop-blur',
        tone
      )}
    >
      <Icon size={13} className={cn(online && pending > 0 && 'animate-spin')} />
      {label}
    </div>
  )
}
