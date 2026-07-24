# Fase 4 — Organização

**Objetivo:** deixar de ser "lista de notas" e virar o produto do mockup — pastas com
contador, tags, favoritos, fixados, lixeira.

**Pré-requisito:** Fase 3 concluída.

---

## 4.1 Pastas

O mockup mostra Trabalho 42, Produto 28, Pessoal 19, Leitura 14, Reuniões 21 — com
bolinha de cor e contador.

- [ ] CRUD de pasta em `features/folders/server/`
- [ ] Criar pasta pelo `+` ao lado de "PASTAS"
- [ ] Renomear inline (duplo clique)
- [ ] Seletor de cor — paleta fixa de 6–8 cores, não color picker livre. Paleta fechada
      mantém a sidebar visualmente coerente e evita o usuário escolher algo ilegível no
      tema escuro
- [ ] Excluir pasta → notas vão para `folderId = null`, **nunca** deletar as notas junto
- [ ] Reordenar por drag (você já tem `@atlaskit/pragmatic-drag-and-drop`) → grava `position`
- [ ] Contador por pasta

> **Cuidado com o contador:** N+1 query aqui é o erro clássico. Faça um único
> `GROUP BY folder_id` e monte um mapa, não uma contagem por pasta.

- [ ] Arrastar nota para pasta na sidebar

---

## 4.2 Tags

O mockup mostra `#trabalho`, `#estratégia` nos cards e `+ adicionar tag` no editor.

- [ ] CRUD em `features/tags/`
- [ ] Input com autocomplete das tags existentes do usuário
- [ ] Criar tag digitando + Enter
- [ ] Normalizar: lowercase, sem espaço nas pontas — para não acabar com `Trabalho`,
      `trabalho` e `trabalho ` como três tags distintas
- [ ] Remover tag da nota
- [ ] Clicar numa tag filtra a lista
- [ ] Limpeza de tags órfãs (sem nota associada), em background

---

## 4.3 Favoritos e fixados

São coisas diferentes e o mockup usa as duas:

- **Favorito** — item de navegação na sidebar ("Favoritas 8")
- **Fixado** — seção "FIXADOS" no topo da lista

- [ ] Toggle de favorito (estrela) no card e no editor
- [ ] Toggle de fixar
- [ ] Seção "FIXADOS" acima da lista normal
- [ ] Visão "Favoritas" na sidebar

---

## 4.4 Agrupamento temporal da lista

O mockup agrupa por "ESTA SEMANA", e os cards mostram "Hoje", "Ontem", "Seg, 18",
"Dom, 17".

- [ ] `formatRelativeDate()` em `src/lib/date.ts`
  - hoje → `Hoje`
  - ontem → `Ontem`
  - últimos 7 dias → `Seg, 18`
  - este ano → `14 mai`
  - anterior → `14/05/2024`
- [ ] Agrupar a lista em Hoje / Ontem / Esta semana / Este mês / Mais antigas
- [ ] Locale pt-BR e en-US desde já — o app já nasce bilíngue por decisão de negócio

Avalie `date-fns` em vez de escrever isso na mão; formatação relativa tem mais casos de
borda do que parece.

---

## 4.5 Ordenação e filtro

O mockup tem as abas **Recentes / Editadas / A–Z** e o contador "8 de 124".

- [ ] Ordenação por `createdAt` / `updatedAt` / `title`
- [ ] Persistir a preferência no `useUiStore`
- [ ] Contador "N de M" refletindo filtro ativo vs total

---

## 4.6 Lixeira

`deletedAt` já existe desde a fase 2 — agora ganha interface.

- [ ] Visão de lixeira
- [ ] Restaurar
- [ ] Excluir definitivamente, com confirmação
- [ ] "Esvaziar lixeira"
- [ ] Purga automática após 30 dias — cron job (Vercel Cron ou `pg_cron` no Supabase)
- [ ] Notas excluídas somem de toda listagem, busca e contador

---

## 4.7 Preview do card

Os cards do mockup mostram duas linhas do conteúdo.

- [ ] Usar `plainText` (já preenchido na fase 2) — **não** parsear o `jsonb` no cliente
- [ ] Truncar em ~140 caracteres, cortando na palavra
- [ ] `line-clamp-2` no CSS

---

## Critério de conclusão da Fase 4

- Criar pasta, mover nota para ela, contador correto
- Adicionar e remover tags, filtrar por tag
- Favoritar e fixar, com as duas seções funcionando
- Excluir, ver na lixeira, restaurar
- Ordenação persistindo entre sessões
- Sidebar do app parecida com a do mockup
