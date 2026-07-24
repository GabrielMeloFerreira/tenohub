import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Client do Supabase para Server Components e Server Actions.
 *
 * Lê e escreve os cookies de sessão via `next/headers`. A escrita pode falhar quando
 * chamada de um Server Component (não é possível setar cookie durante o render) — o
 * try/catch cobre esse caso; o middleware é quem de fato renova a sessão.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Chamado de um Server Component — ignorável, o middleware renova a sessão.
          }
        },
      },
    }
  )
}
