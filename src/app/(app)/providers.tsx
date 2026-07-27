'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useState } from 'react'

import { makeQueryClient } from '@/lib/query-client'
import { createIdbPersister } from '@/lib/idb-persister'

// Suba esta versao quando o formato do cache mudar: invalida caches antigos e evita
// hidratar dados em formato velho (o "fantasma" da fase 3.2).
const CACHE_BUSTER = 'v1'
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  const [persister] = useState(createIdbPersister)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: THIRTY_DAYS, buster: CACHE_BUSTER }}
      onSuccess={() => {
        // Cache restaurado do IndexedDB: retoma mutacoes que ficaram pausadas offline
        // numa sessao anterior (reload/crash). Sao idempotentes, entao nao duplicam.
        queryClient.resumePausedMutations()
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  )
}
