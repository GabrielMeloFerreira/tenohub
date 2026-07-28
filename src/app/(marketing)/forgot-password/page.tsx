import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm'
import type { NoticeData } from '@/features/auth/components/form'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const sp = await searchParams

  const notice: NoticeData | null = sp.sent
    ? { type: 'success', text: 'Se o e-mail existir, enviamos um link para redefinir a senha.' }
    : null

  return <ForgotPasswordForm notice={notice} />
}
