'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { requestPasswordReset, type AuthState } from '../server/actions'
import { Notice, authInputClass, type NoticeData } from './form'

export default function ForgotPasswordForm({ notice = null }: { notice?: NoticeData | null }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    null
  )

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Redefinir senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Informe seu e-mail e enviaremos um link para criar uma nova senha.
        </p>
      </div>

      <Notice notice={notice} />

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail"
          className={authInputClass}
        />

        <Notice notice={state?.error ? { type: 'error', text: state.error } : null} />

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Aguarde…' : 'Enviar link'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
