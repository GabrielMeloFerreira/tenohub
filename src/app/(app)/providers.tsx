'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useState } from 'react'

import { makeQueryClient } from '@/lib/query-client'
import { createIdbPersister } from '@/lib/idb-persister'
import { registerNoteMutations } from '@/features/notes/query'
import { registerFolderMutations } from '@/features/folders/query'
import { registerTagMutations } from '@/features/tags/query'

const CACHE_BUSTER = 'v1'
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30

function buildQueryClient() {
  const qc = makeQueryClient()
  registerNoteMutations(qc)
  registerFolderMutations(qc)
  registerTagMutations(qc)
  return qc
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(buildQueryClient)
  const [persister] = useState(createIdbPersister)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: THIRTY_DAYS, buster: CACHE_BUSTER }}
      onSuccess={() => {
        queryClient.resumePausedMutations()
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  )
}
