import NotesWorkspace from '@/features/notes/components/NotesWorkspace'
import { listFolders } from '@/features/folders/server/actions'
import { getNotes } from '@/features/notes/server/queries'
import { requireUser } from '@/server/auth'

export default async function Home() {
  const user = await requireUser()
  const [initialNotes, initialFolders] = await Promise.all([getNotes(), listFolders()])

  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    'você'

  return (
    <NotesWorkspace
      initialNotes={initialNotes}
      initialFolders={initialFolders}
      user={{ name, email: user.email ?? '' }}
    />
  )
}
