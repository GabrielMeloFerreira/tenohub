import 'server-only'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

/** Usuário autenticado, ou null. Use em Server Components para render condicional. */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Usuário autenticado, ou redireciona para /login.
 *
 * Use no topo de toda Server Action e query que toca dados do usuário. O middleware já
 * protege as rotas, mas Server Actions são endpoints POST independentes — reautenticar
 * aqui é o que garante que o `userId` usado nas queries é real, não confiável do cliente.
 */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
