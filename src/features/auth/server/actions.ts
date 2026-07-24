'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'A senha precisa de ao menos 8 caracteres.'),
})

export type AuthState = { error?: string } | null

async function origin() {
  const h = await headers()
  return h.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { error: 'E-mail ou senha inválidos.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: 'E-mail ou senha incorretos.' }

  redirect('/')
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${await origin()}/auth/callback` },
  })
  if (error) return { error: error.message }

  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${await origin()}/auth/callback` },
  })
  if (error || !data.url) redirect('/login?error=oauth')
  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
