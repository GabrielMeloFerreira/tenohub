import NotesWorkspace from '@/features/notes/components/NotesWorkspace'
import { listFolders } from '@/features/folders/server/actions'
import { getNotes } from '@/features/notes/server/queries'
import { listNoteTagLinks, listTags } from '@/features/tags/server/actions'
import { requireUser } from '@/server/auth'

export default async function Home() {
  const user = await requireUser()
  const [initialNotes, initialFolders, initialTags, initialNoteTagLinks] = await Promise.all([
    getNotes(),
    listFolders(),
    listTags(),
    listNoteTagLinks(),
  ])

  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    'você'

  return (
    <NotesWorkspace
      initialNotes={initialNotes}
      initialFolders={initialFolders}
      initialTags={initialTags}
      initialNoteTagLinks={initialNoteTagLinks}
      user={{ name, email: user.email ?? '' }}
    />
  )
}
