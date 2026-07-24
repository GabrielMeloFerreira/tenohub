'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { login, signInWithGoogle, signup, type AuthState } from '../server/actions'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

const copy = {
  login: {
    title: 'Entrar no Tenohub',
    submit: 'Entrar',
    switchText: 'Não tem conta?',
    switchHref: '/signup',
    switchLink: 'Criar conta',
  },
  signup: {
    title: 'Criar conta',
    submit: 'Criar conta',
    switchText: 'Já tem conta?',
    switchHref: '/login',
    switchLink: 'Entrar',
  },
} as const

export default function AuthForm({ mode }: AuthFormProps) {
  const action = mode === 'login' ? login : signup
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null)
  const t = copy[mode]

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Continuar com Google
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="Senha"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring"
        />

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Aguarde…' : t.submit}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t.switchText}{' '}
        <Link href={t.switchHref} className="text-primary hover:underline">
          {t.switchLink}
        </Link>
      </p>
    </div>
  )
}
