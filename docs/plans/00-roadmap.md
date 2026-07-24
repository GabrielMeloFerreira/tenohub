# Tenohub — Roadmap de Implementação

Visão geral das fases e das decisões arquiteturais que as amarram.

## Stack definida

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router) — front e back no mesmo projeto |
| Banco | Supabase Postgres |
| Acesso a dados | Drizzle ORM (connection string direta) |
| Auth | Supabase Auth |
| Arquivos | Supabase Storage |
| Estado de servidor | TanStack Query |
| Estado de UI | Zustand |
| Estilo | Tailwind v4 + shadcn (base-ui) |
| Editor | TipTap, conteúdo salvo como JSON em `jsonb` |
| Deploy | Vercel (Hobby enquanto pessoal → Pro ao monetizar) |
| Pagamento | Stripe ou MoR — decidir com o contador, fase 6 |

## Decisões que não devem ser revistas sem motivo forte

**Um repositório, um deploy.** Server actions do Next são o backend. Toda lógica de
servidor vive em `features/*/server/` e `src/server/`, isolada — se um dia precisar
extrair para um serviço separado, é mover pasta, não reescrever.

**IDs gerados no cliente (UUID v7).** Sem isso não existe criação de nota offline.
Decisão irreversível na prática — o custo de trocar depois é migração de dados.

**Conteúdo como JSON do TipTap em `jsonb`, nunca HTML.** Permite extrair texto puro
para busca, contar palavras, transformar e alimentar IA sem parsear string.

**Soft delete (`deleted_at`) desde o dia 1.** Dá lixeira de graça e evita chamado de
suporte por nota apagada sem querer.

**Tipos pertencem à feature dona do conceito.** `Note` mora em
`features/notes/types.ts`, `Folder` em `features/folders/types.ts`, e assim por diante.
Quem precisa importa da feature dona — `features/tasks` importando `Note` é normal.
Não existe bucket global de tipos: bucket não tem dono, cresce sem critério e ninguém
deleta nada de lá. `src/types/` foi eliminado na fase 1 justamente por isso.

Duas consequências:

- **Props de componente ficam no arquivo do componente**, sempre. Não são compartilhadas.
- **Na fase 2, `features/*/types.ts` vira fachada do schema do Drizzle**
  (`typeof notes.$inferSelect`). Componentes client importam da feature, **nunca** de
  `@/server/db` — mesmo sendo `import type`, a fachada evita que alguém troque por um
  import de valor sem perceber e arraste código de servidor para o bundle.

**Sync server-autoritativo com update otimista.** CRDT (Yjs) só quando houver edição
simultânea real por múltiplos usuários. As fases 1–3 preparam o terreno para que o
Yjs entre depois apenas no campo `content`, sem tocar no resto.

## Fases

| # | Fase | Entrega | Doc |
|---|---|---|---|
| 1 | Fundação | Build verde, estado ligado, deps limpas, estrutura nova | [01-fundacao.md](01-fundacao.md) |
| 2 | Dados e Auth | Login funcionando, notas persistindo no Postgres | [02-dados-auth.md](02-dados-auth.md) |
| 3 | Sync e Offline | Escrita otimista, cache em IndexedDB, fila de mutações | [03-sync-offline.md](03-sync-offline.md) |
| 4 | Organização | Pastas, tags, favoritos, pin, lixeira | [04-organizacao.md](04-organizacao.md) |
| 5 | Busca e Editor | ⌘K, full-text, slash commands, callouts | [05-busca-editor.md](05-busca-editor.md) |
| 6 | Produto | Billing, landing, onboarding | — planejar depois da fase 5 |
| 7 | Tarefas e Calendário | As duas features secundárias do mockup | — planejar depois da fase 6 |

## Marco importante entre a fase 5 e a 6

**Usar o app você mesmo, todo dia, por duas semanas, antes de escrever qualquer linha
de billing.** Você vai descobrir mais sobre o produto nesse período do que em qualquer
planejamento. Features que parecem essenciais no papel somem, e detalhes que ninguém
planejou viram prioridade.

## Ordem de leitura

Cada doc de fase é auto-contido e tem critério de conclusão explícito. Não comece uma
fase sem que a anterior esteja com todos os critérios marcados — as dependências entre
elas são reais, especialmente 2 → 3.
