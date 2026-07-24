# Fase 2 — Dados e Autenticação

> **Status: backend concluído e verificado contra o banco real (24/07/2026).**
> Falta só a verificação do fluxo de login no navegador e a config do painel do
> Supabase (Google OAuth). Detalhes no fim do documento, em **Estado da execução**.

**Objetivo:** login funcionando e notas persistindo em Postgres. Ao final, recarregar
a página não perde nada e abrir em outro dispositivo mostra as mesmas notas.

**Pré-requisito:** Fase 1 concluída.

---

## 2.1 Provisionar o Supabase

- [ ] Criar projeto no Supabase (região `sa-east-1` / São Paulo, se disponível — menor
      latência para você e para o público BR)
- [ ] Guardar as credenciais em `.env.local`:

```
DATABASE_URL=                          # connection string (pooler, porta 6543)
DIRECT_URL=                            # conexão direta (porta 5432) — só para migrations
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=             # NUNCA expor ao cliente
```

- [ ] Confirmar que `.env.local` está no `.gitignore`
- [ ] Criar `.env.example` com as chaves vazias, versionado

> **Atenção ao free tier:** projetos gratuitos pausam após cerca de uma semana sem
> atividade. Sem problema para o projeto principal que você usa diariamente — mas não
> deixe um ambiente de staging parado achando que está no ar.

---

## 2.2 Drizzle

- [ ] Instalar: `drizzle-orm`, `postgres` (driver), `drizzle-kit` (dev)
- [ ] `drizzle.config.ts` na raiz, apontando para `src/server/db/schema.ts` e usando
      `DIRECT_URL` para migrations
- [ ] `src/server/db/index.ts` exportando o client, usando `DATABASE_URL` (pooler)
- [ ] Scripts no `package.json`:

```json
"db:generate": "drizzle-kit generate",
"db:migrate":  "drizzle-kit migrate",
"db:studio":   "drizzle-kit studio"
```

---

## 2.3 Schema

`src/server/db/schema.ts`. Cobre o que o mockup mostra — pastas com contador, tags,
favoritos, pin, tarefas e assinatura.

```ts
// notes
id            uuid  PK          // gerado no CLIENTE (ver 2.4)
userId        uuid  NOT NULL    // → auth.users.id
folderId      uuid  NULL        // → folders.id, ON DELETE SET NULL
title         text  NOT NULL DEFAULT ''
content       jsonb NOT NULL DEFAULT '{}'   // JSON do TipTap, nunca HTML
plainText     text  NOT NULL DEFAULT ''     // extraído do content, alimenta a busca
wordCount     integer NOT NULL DEFAULT 0
isPinned      boolean NOT NULL DEFAULT false
isFavorite    boolean NOT NULL DEFAULT false
createdAt     timestamptz NOT NULL DEFAULT now()
updatedAt     timestamptz NOT NULL DEFAULT now()
deletedAt     timestamptz NULL              // soft delete

// folders
id, userId, name, color, position(integer), createdAt, deletedAt

// tags
id, userId, name
UNIQUE (userId, name)

// noteTags
noteId, tagId          PK composta, ambos ON DELETE CASCADE

// tasks
id, userId, noteId(NULL), title, isDone, dueAt, createdAt, deletedAt

// subscriptions
userId PK, status, plan, currentPeriodEnd, externalId, provider
```

**Notas de projeto:**

- `subscriptions` é **agnóstica ao gateway** de propósito. `externalId` + `provider`
  guardam a referência de quem processar o pagamento, e a decisão Stripe vs MoR
  (fase 6) não força migração.
- `plainText` é redundante em relação a `content`, e isso é intencional: buscar dentro
  de `jsonb` é lento e desconfortável. Preencha na hora de salvar.
- `deletedAt` em tudo que o usuário cria.

**Índices — não pule, é o que segura a performance da lista:**

- [ ] `notes (user_id, updated_at DESC) WHERE deleted_at IS NULL` — a listagem padrão
- [ ] `notes (user_id, folder_id) WHERE deleted_at IS NULL`
- [ ] `notes USING GIN (to_tsvector('portuguese', plain_text))` — fase 5
- [ ] `folders (user_id, position)`

---

## 2.4 IDs no cliente

**A decisão mais importante desta fase.** Se o banco gerar o ID, você não consegue criar
nota offline — ela não tem identidade até o servidor responder. Isso inviabiliza a
fase 3 inteira.

- [ ] Instalar o pacote `uuidv7`
- [ ] `src/lib/id.ts` exportando `newId()`

  Use **v7**, não v4. O v7 é ordenável por tempo, então inserções ficam sequenciais no
  índice em vez de espalhadas — diferença real de performance conforme a tabela cresce.
  (`crypto.randomUUID()` do navegador gera v4.)

- [ ] Nenhuma coluna `id` tem default no banco. O cliente sempre envia.

---

## 2.5 Auth

Supabase Auth. Como o Supabase já traz login integrado ao banco, **não usar Better Auth**
— seria duplicar a mesma responsabilidade.

- [ ] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [ ] `src/server/auth/` com três clients:
  - browser client (`createBrowserClient`)
  - server client (`createServerClient`, lê cookies)
  - middleware client (renova sessão)
- [ ] `middleware.ts` na raiz protegendo `/(app)/*` e renovando o token
- [ ] Provedores: **e-mail/senha + Google**. Google resolve a maioria e elimina fluxo de
      recuperação de senha no começo
- [ ] `app/(marketing)/login/page.tsx` e `/signup`
- [ ] `getCurrentUser()` server-side em `src/server/auth/`

---

## 2.6 Segurança de acesso

Modelo: **toda leitura e escrita passa pelo servidor Next**, filtrando por `userId` no
código da aplicação.

- [ ] Habilitar RLS em todas as tabelas, com policy `user_id = auth.uid()`
- [ ] Toda query em `features/*/server/` filtra por `userId` **explicitamente**

> **Isso não é redundância inútil, e a ordem importa.** Se você conectar via connection
> string com o usuário `postgres` — que é o que o Drizzle faz — **RLS é ignorado**. A
> autorização real mora no seu código. O RLS é rede de segurança para o dia em que
> alguma chamada escapar pelo client SDK. Nunca dependa só dele, e nunca omita o filtro
> por `userId` "porque tem RLS".

---

## 2.7 Camada de dados

- [ ] `features/notes/server/queries.ts` — `listNotes`, `getNote`
- [ ] `features/notes/server/mutations.ts` — `createNote`, `updateNote`, `deleteNote`
      (soft), `restoreNote`
- [ ] Validação com **Zod em toda entrada** de server action. Payload vindo do cliente
      é sempre não confiável, inclusive o seu próprio
- [ ] Todo arquivo em `server/` começa com `import 'server-only'`
- [ ] `useNotes` da fase 1 passa a chamar essas actions em vez do array em memória —
      **a assinatura do hook não muda**, só a implementação

---

## 2.8 Migrar os mocks

- [ ] `src/data/mockNotes.ts` sai
- [ ] Seed opcional em `scripts/seed.ts` para popular sua conta de dev

---

## Critério de conclusão da Fase 2

- [x] `tsc --noEmit`, `lint` e `build` limpos
- [x] Schema no banco: 6 tabelas, índices, RLS ligado + 6 policies `auth.uid() = user_id`
- [x] Camada de dados verificada (insert/select/soft-delete via DATABASE_URL) contra o banco real
- [x] Middleware protege a área logada (runtime: `/` sem sessão → 307 → `/login`)
- [x] Nenhuma chave de serviço exposta ao cliente
- [ ] Signup, login e logout **pelo navegador** — falta verificar (precisa de sessão real)
- [ ] Criar nota → recarregar → continua lá — falta verificar pela UI
- [ ] Abrir em outro navegador com a mesma conta → as mesmas notas
- [ ] Dois usuários não enxergam nada um do outro (**testar com duas contas** — revela
      filtro de `userId` esquecido)

---

## Estado da execução (24/07/2026)

### Verificado contra o banco real

`.env.local` já estava preenchido, então deu para ir além do scaffolding:

- Migration `0000` gerada e aplicada — 6 tabelas com colunas, índices e FKs corretos.
- Migration `0001` aplicada — RLS ligado e 6 policies de dono (`auth.uid() = user_id`;
  `note_tags` deriva a posse da nota). Confirmado via `pg_policies`.
- Smoke test da camada de dados: insert → select (filtrado por `userId` + `deletedAt`)
  → soft-delete → cleanup, tudo OK. O role do pooler ignora RLS, exatamente como o
  modelo §2.6 assume — a autorização real é o filtro por `userId` no código.
- Middleware testado em runtime: rota protegida sem sessão redireciona (307) para
  `/login`; `/login` e `/signup` respondem 200.

### NÃO verificado (precisa de você)

- **Login/signup/logout reais no navegador** e a persistência de nota pela UI. Precisa
  de uma sessão autenticada de verdade, que não dá para simular por script.
- **Google OAuth** — o código está pronto (`signInWithGoogle`, `/auth/callback`), mas o
  provider precisa ser habilitado no painel. Ver runbook abaixo.
- **Isolamento entre dois usuários** — o teste que mais importa fazer.

### Runbook — o que só você pode fazer

1. **Habilitar Google** (opcional, mas o botão já está na tela): painel do Supabase →
   Authentication → Providers → Google → colar Client ID/Secret do Google Cloud, e
   registrar `https://<ref>.supabase.co/auth/v1/callback` como redirect URI no Google.
   Sem isso, use e-mail/senha normalmente.
2. **Confirmação de e-mail**: por padrão o Supabase exige confirmar o e-mail antes do
   primeiro login. Para testar rápido em dev, Authentication → Providers → Email →
   desligar "Confirm email"; ou confirmar pelo link que chega no e-mail.
3. **Testar**: `npm run dev`, criar conta em `/signup`, criar uma nota, recarregar,
   confirmar que persistiu. Depois criar uma segunda conta e confirmar que ela não vê
   as notas da primeira.
4. **Popular dados (opcional)**: `npm run db:seed <user-id>` — o `<user-id>` está em
   Authentication → Users.

### Desvios em relação ao plano

- **Clients do Supabase em `src/lib/supabase/`**, não em `src/server/auth/`. O browser
  client não pode ser `server-only`; juntá-los sob `server/` seria enganoso. `server/auth/`
  ficou só com `getCurrentUser`/`requireUser`.
- **`DIRECT_URL` aponta para o session pooler (porta 5432), não para o host direto.** O
  host `db.<ref>.supabase.co` é IPv6-only e não resolve nesta rede (`ENOTFOUND`) — erro
  clássico do Supabase. O session pooler (`...pooler.supabase.com:5432`) é IPv4 e roda
  migrations sem problema. Já ajustado no `.env.local`.
- **`queries.ts` + `actions.ts`** em vez de `queries.ts` + `mutations.ts`. As mutações
  são Server Actions (`'use server'`), invocáveis do cliente; separei-as das leituras
  `server-only` por essa fronteira, não por serem leitura/escrita.
- **Página virou Server Component** (`(app)/page.tsx`) que carrega as notas e passa para
  o `NotesWorkspace` (client). A `NavSidebar` subiu para dentro do workspace e agora
  mostra nome/e-mail reais do usuário, com botão de logout.
- **`useNotes(initialNotes)`** agora tem escrita otimista + debounce de 800ms + rollback.
  É a versão mínima; a fase 3 troca por TanStack Query mantendo a assinatura.
- **RLS já vinha ligado** nas tabelas novas; a migration `0001` reforça (idempotente) e
  adiciona as policies que faltavam.
- **Comentários do `schema.ts` ficam em ASCII** — backticks + acentos no arquivo
  dispararam um bug de parse do `tsc` (template literal fantasma). Mantidos sem acento
  de propósito.
