import { config } from 'dotenv'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import type { JSONContent } from '@tiptap/react'

import { notes } from '../src/server/db/schema'
import { titleFromDoc } from '../src/features/notes/utils'

config({ path: '.env.local' })

const url = process.env.DIRECT_URL
if (!url) throw new Error('DIRECT_URL nao definida.')

async function main() {
  const client = postgres(url!, { prepare: false })
  const db = drizzle(client)

  const all = await db.select().from(notes)
  let migrated = 0

  for (const note of all) {
    const doc = note.content as JSONContent
    const title = (note.title ?? '').trim()
    if (!title) continue
    if (titleFromDoc(doc) === title) continue

    const newContent: JSONContent = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: title }] },
        ...(doc.content ?? []),
      ],
    }
    await db.update(notes).set({ content: newContent }).where(eq(notes.id, note.id))
    migrated++
  }

  console.log(`${migrated} nota(s) migrada(s) de ${all.length}`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
