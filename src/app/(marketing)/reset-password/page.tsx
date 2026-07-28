import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm'
import { requireUser } from '@/server/auth'

export default async function ResetPasswordPage() {
  await requireUser()

  return <ResetPasswordForm />
}
