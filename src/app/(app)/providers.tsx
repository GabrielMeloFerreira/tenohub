'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

import { makeQueryClient } from '@/lib/query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState garante um QueryClient por montagem do app, estável entre re-renders.
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
