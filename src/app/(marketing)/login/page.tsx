import AuthForm from '@/features/auth/components/AuthForm'
import type { NoticeData } from '@/features/auth/components/form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string; error?: string }>
}) {
  const sp = await searchParams

  const notice: NoticeData | null = sp.registered
    ? { type: 'success', text: 'Conta criada com sucesso! Faca login para continuar.' }
    : sp.reset
      ? { type: 'success', text: 'Senha alterada com sucesso! Faca login com a nova senha.' }
      : sp.error
        ? { type: 'error', text: 'Nao foi possivel autenticar. Tente novamente.' }
        : null

  return <AuthForm mode="login" notice={notice} />
}
