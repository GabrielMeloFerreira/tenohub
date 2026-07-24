import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL não definida. Copie .env.example para .env.local.')
}

/*
 * `prepare: false` é obrigatório com o pooler de transação do Supabase (porta 6543):
 * o pooler não suporta prepared statements. Migrations usam DIRECT_URL, não este client.
 */
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
