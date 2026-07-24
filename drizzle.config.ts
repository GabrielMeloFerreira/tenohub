import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })

// Migrations exigem conexão direta (porta 5432), não o pooler de transação.
const url = process.env.DIRECT_URL
if (!url) throw new Error('DIRECT_URL não definida. Ver .env.example.')

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
  casing: 'snake_case',
})
