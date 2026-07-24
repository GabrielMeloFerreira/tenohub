/*
 * Popular a conta de dev com notas de exemplo.
 *
 *   npx tsx scripts/seed.ts <user-id>
 *
 * O <user-id> é o UUID do usuário em Authentication › Users no painel do Supabase.
 * Usa DIRECT_URL (conexão direta), não o pooler.
 */
import { config } from 'dotenv'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

import { notes } from '../src/server/db/schema'
import { docFromText } from '../src/features/notes/utils'
import { newId } from '../src/lib/id'

config({ path: '.env.local' })

const userId = process.argv[2]
if (!userId) {
  console.error('Uso: npx tsx scripts/seed.ts <user-id>')
  process.exit(1)
}

const url = process.env.DIRECT_URL
if (!url) throw new Error('DIRECT_URL não definida.')

const samples = [
  {
    title: 'Q4 — Estratégia de relançamento',
    text: 'Antes de dezembro a gente precisa reposicionar o produto para um público que entende valor.',
  },
  {
    title: 'Reunião com a Carla — kickoff',
    text: 'Definir escopo do redesign, próximas 2 sprints. Carla traz o documento na quinta.',
  },
  {
    title: 'Ideias soltas — feature toggles',
    text: 'Sistema de feature flags por workspace, não por user. Começar pelo plano Pro.',
  },
]

async function main() {
  const client = postgres(url!, { prepare: false })
  const db = drizzle(client)

  await db.insert(notes).values(
    samples.map((s) => {
      const content = docFromText(s.text)
      return {
        id: newId(),
        userId,
        title: s.title,
        content,
        plainText: s.text,
        wordCount: s.text.split(/\s+/).filter(Boolean).length,
      }
    })
  )

  console.log(`${samples.length} notas criadas para ${userId}`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
