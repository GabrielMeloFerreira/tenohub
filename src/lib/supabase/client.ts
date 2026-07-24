import { createBrowserClient } from '@supabase/ssr'

/** Client do Supabase para componentes que rodam no navegador. Não é server-only. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
