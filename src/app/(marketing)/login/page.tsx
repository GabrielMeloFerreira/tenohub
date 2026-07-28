import AuthForm from '@/features/auth/components/AuthForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; error?: string }>
}) {
  const sp = await searchParams

  const notice = sp.registered
    ? { type: 'success' as const, text: 'Conta criada com sucesso! Faca login para continuar.' }
    : sp.error
      ? { type: 'error' as const, text: 'Nao foi possivel autenticar. Tente novamente.' }
      : null

  return <AuthForm mode="login" notice={notice} />
}
