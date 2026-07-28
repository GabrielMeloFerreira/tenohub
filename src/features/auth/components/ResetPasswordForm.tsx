'use client'

import { useActionState } from 'react'

import { updatePassword, type AuthState } from '../server/actions'
import { Notice, authInputClass } from './form'

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(updatePassword, null)

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold text-foreground">Nova senha</h1>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Nova senha"
          className={authInputClass}
        />
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Confirmar nova senha"
          className={authInputClass}
        />
        <p className="text-xs text-muted-foreground">
          Minimo 6 caracteres e ao menos um caractere especial.
        </p>

        <Notice notice={state?.error ? { type: 'error', text: state.error } : null} />

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Aguarde…' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  )
}
