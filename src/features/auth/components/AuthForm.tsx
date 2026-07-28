'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { login, signInWithGoogle, signup, type AuthState } from '../server/actions'
import { Notice, authInputClass, type NoticeData } from './form'
import GoogleIcon from './GoogleIcon'

interface AuthFormProps {
  mode: 'login' | 'signup'
  notice?: NoticeData | null
}

const copy = {
  login: {
    title: 'Entrar no Tenohub',
    submit: 'Entrar',
    switchText: 'Nao tem conta?',
    switchHref: '/signup',
    switchLink: 'Criar conta',
  },
  signup: {
    title: 'Criar conta',
    submit: 'Criar conta',
    switchText: 'Ja tem conta?',
    switchHref: '/login',
    switchLink: 'Entrar',
  },
} as const

export default function AuthForm({ mode, notice = null }: AuthFormProps) {
  const isSignup = mode === 'signup'
  const action = isSignup ? signup : login
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null)
  const t = copy[mode]

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>

      <Notice notice={notice} />

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <GoogleIcon />
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
          className={authInputClass}
        />
        <input
          name="password"
          type="password"
          required
          minLength={isSignup ? 6 : undefined}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          placeholder="Senha"
          className={authInputClass}
        />

        {isSignup && (
          <>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirmar senha"
              className={authInputClass}
            />
            <p className="text-xs text-muted-foreground">
              Minimo 6 caracteres e ao menos um caractere especial.
            </p>
          </>
        )}

        {!isSignup && (
          <Link
            href="/forgot-password"
            className="self-end text-xs text-muted-foreground hover:text-foreground"
          >
            Esqueci minha senha
          </Link>
        )}

        <Notice notice={state?.error ? { type: 'error', text: state.error } : null} />

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
