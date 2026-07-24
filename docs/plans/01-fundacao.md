# Fase 1 — Fundação

> **Status: concluída (24/07/2026).** `typecheck`, `lint` e `build` verdes.
> Desvios em relação ao plano original estão anotados no fim do documento.

**Objetivo:** build verde, estado circulando de verdade, dependências enxutas e
estrutura de pastas por feature. Nada de banco ainda — tudo em memória.

**Por que primeiro:** hoje o projeto não compila e o estado não sai do hook. Qualquer
feature construída antes disso é construída sobre areia.

---

## 1.1 Destravar o build

- [ ] `npm install` — `node_modules` não existe no ambiente atual
- [ ] **Deletar** `src/components/ui/link/LinkPop.tsx`

  Sintaticamente inválido (`export default function LinkPop {`, sem parênteses) e
  importa `@/components/tiptap-ui/link-popover`, que não existe no projeto. É código
  morto de uma tentativa anterior. O popover de link é reconstruído na fase 5.

- [ ] `npx tsc --noEmit` até sair limpo
- [ ] `npm run dev` sobe sem erro

**Pronto quando:** `tsc --noEmit` retorna zero erros.

---

## 1.2 Limpar dependências

Remover — nenhuma é usada, e algumas competem diretamente com o que ficou:

```
@puckeditor/core          page builder, não é o caso de uso
reactjs-tiptap-editor     wrapper de TipTap; você usa o TipTap direto
@radix-ui/react-popover   shadcn aqui está em base-ui, não radix
@floating-ui/react        sem uso
react-resizable           sem uso (o import no globals.css sai junto)
lucide                    duplicata de lucide-react
@mui/material             ver 1.3
@mui/icons-material       ver 1.3
@emotion/react            só existe por causa do MUI
@emotion/styled           só existe por causa do MUI
```

- [ ] Remover as deps acima do `package.json`
- [ ] Remover `@import 'react-resizable/css/styles.css'` do `globals.css`
- [ ] `npm install` e conferir que o build segue verde

**Manter:** `@atlaskit/pragmatic-drag-and-drop` e `tiny-invariant` (drag das notas),
`react-resizable-panels` (usado pelo `ui/resizable.tsx`), `sass` se houver `.scss`.

---

## 1.3 Trocar ícones MUI por lucide-react

O mockup é design autoral com tipografia serifada e acento quente. MUI carrega o
Material Design inteiro junto e vai brigar com isso em cada componente — além de
arrastar o Emotion (CSS-in-JS runtime) para dentro de um projeto Tailwind.

- [ ] `src/components/NoteEditor/ToolBar.tsx` — 13 ícones

  | MUI | lucide-react |
  |---|---|
  | `FormatBold` | `Bold` |
  | `FormatItalic` | `Italic` |
  | `FormatUnderlined` | `Underline` |
  | `StrikethroughS` | `Strikethrough` |
  | `AddLink` | `Link` |
  | `Undo` / `Redo` | `Undo` / `Redo` |
  | `FormatAlign*` | `AlignLeft` / `AlignCenter` / `AlignRight` / `AlignJustify` |
  | `Divider` | `<div className="w-px bg-border mx-1" />` ou `ui/separator` |

- [ ] `src/components/Sidebar/UserSideBar.tsx` — `FirstPageIcon` → `PanelLeftClose`

---

## 1.4 Corrigir os comandos de alinhamento do TipTap

`editor.chain().focus().toggleTextAlign(...)` **não existe**. Os quatro botões de
alinhamento em `ToolBar.tsx:53-64` não fazem nada hoje.

- [ ] Trocar por `setTextAlign('left' | 'center' | 'right' | 'justify')`
- [ ] Usar `getButtonClass(editor.isActive({ textAlign: 'center' }))` para o estado ativo
      — hoje os botões de alinhamento usam `getStatelessButtonClass()` e nunca acendem
- [ ] Conferir se `toggleLink()` sem `href` faz algo útil; se não, desabilitar o botão
      até a fase 5 (é o que o `LinkPop` deletado tentava resolver)

---

## 1.5 Consertar o tema

Três problemas se somando:

**Tokens fantasma.** `bg-bg-base`, `bg-bg-elevated` e `text-text-muted` são usados em
`NavSidebar.tsx:32-34` e `toolbarStyles.ts:12`, mas o bloco `@theme` só define
`--color-base`, `--color-border`, `--color-white-text`, `--color-notes-*` e
`--color-buttons-*`. Essas classes são silenciosamente no-op.

**Tema claro num app escuro.** As variáveis shadcn no `:root` são todas light, a classe
`.dark` nunca é aplicada no `<html>`, e você compensa com `text-white` hardcoded em
todo componente.

**`--color-base` duplicado** no `:root` e no `@theme inline`.

- [ ] Aplicar `className="dark"` no `<html>` em `layout.tsx` (o mockup é dark-first;
      o toggle claro/escuro que aparece no canto inferior direito vem na fase 6)
- [ ] Definir os tokens que faltam no `@theme`, ou renomear os usos para os que existem —
      escolher um vocabulário só e documentar aqui
- [ ] Remover a duplicata de `--color-base`
- [ ] Remover os `text-white` hardcoded conforme migrar para `text-foreground`

---

## 1.6 Unificar duplicações

- [ ] `cn` existe em `src/lib/utils.ts` **e** `src/utils/cn.ts`, idênticas.
      Manter `src/lib/utils.ts` (é o alias que o `components.json` aponta), deletar a outra,
      atualizar o import em `NoteModal.tsx`
- [ ] `ui/button.tsx` (shadcn) vs `ui/button/Button.tsx` (custom) — mesmo nome, pastas
      diferentes, confusão garantida. Manter o shadcn como primitivo; o custom vira
      `features/*/components/` se ainda for necessário, ou some
- [ ] `ui/input.tsx` vs `ui/input-text/InputText.tsx` — mesma decisão
- [ ] `src/utils/` inteiro migra para `src/lib/`; `toolbarStyles.ts` vai para
      `features/notes/`

---

## 1.7 Estrutura de pastas por feature

Migrar de organização por tipo para organização por feature:

```
src/
  app/
    (marketing)/          landing, preços — público
    (app)/                área logada
      layout.tsx          sidebar + shell
      notes/[id]/page.tsx
    api/
    layout.tsx
    globals.css
  features/
    notes/
      components/         NoteEditor, ToolBar, NoteCard, NoteList
      hooks/              useNote, useNotes
      server/             queries e mutations (server-only)
      schema.ts           zod
      styles.ts           ex-toolbarStyles
    folders/
    tags/
    tasks/
    search/
    billing/
  server/
    db/                   schema drizzle, client
    auth/
  components/
    ui/                   shadcn puro — só primitivo genérico e burro
    layout/               shell, sidebar
  lib/                    cn, datas, uuid
  types/                  só tipos realmente transversais
```

**Regra:** componente usado por uma feature só mora dentro dela. `components/ui/` é
exclusivamente primitivo sem regra de negócio.

- [ ] Criar a árvore
- [ ] Mover `NoteEditor/` e `SideNotes/` → `features/notes/components/`
- [ ] Mover `Sidebar/` → `components/layout/`
- [ ] Mover `hooks/useSideBar.ts` → será desmontado em 1.8
- [ ] Ajustar imports

---

## 1.8 Ligar o estado (o coração desta fase)

Hoje `useSideBar` (`src/hooks/useSideBar.ts:29-33`) guarda `notes` e `selectedId` no
`useState` e **não retorna nenhum dos dois**. `handleClickNewNote` cria a nota e ela
desaparece. Em paralelo, `SideNotes.tsx:18` renderiza `<NoteModal />` nove vezes sem
props, embora `NoteModal` exija `notes`, `selectedId` e `onSelectNote` obrigatórios —
erro de tipo garantido assim que o build voltar a rodar.

Quebrar o hook em dois, com responsabilidades separadas:

- [ ] **`useUiStore` (Zustand)** — `view`, `selectedNoteId`, `sidebarOpen`.
      Só estado de interface.
- [ ] **`useNotes`** — CRUD em memória por enquanto (`mockNotes` como seed).
      Vira TanStack Query na fase 2 sem mudar a assinatura.
- [ ] `SideNotes` recebe `notes`, `selectedId`, `onSelectNote` e faz `notes.map(...)`
      em vez dos nove `<NoteModal />` fixos
- [ ] `NoteModal` recebe **uma** `note` (não o array inteiro) + `isSelected` + `onSelect`
- [ ] `NoteEditor` recebe a nota selecionada e emite `onChange`
- [ ] Título do editor vira input controlado — hoje é placeholder solto

**Pronto quando:** criar nota → ela aparece na lista → clicar seleciona → editar título
e corpo reflete na lista → e nada disso sobrevive ao reload (esperado; persistência é
fase 2).

---

## 1.9 Faxina

- [ ] `NoteModal.tsx` — remover `console.log("a", dragging)` (linha 31) e o import
      não usado de `use` (linha 2)
- [ ] `NoteModal.tsx:22` — `invariant(el)` lança **antes** do `if (!el) return` logo
      abaixo, tornando o guard inalcançável. Escolher um dos dois
- [ ] `NoteModal.tsx:30` — deps do `useEffect` são `[notes, selectedId, onSelectNote]`,
      o que reinicializa o draggable a cada render do pai. Deve ser `[]`
- [ ] `NavSidebar.tsx` — decidir entre o `Sidebar` do shadcn (casca vazia hoje, com
      `SidebarGroup` sem conteúdo) e a `<nav>` comentada nas linhas 57-78, que era a
      versão que funcionava. **Sugestão:** reconstruir sobre o shadcn usando `navItems`
      (declarado na linha 24 e nunca usado), e apagar o bloco comentado
- [ ] `NavSidebar.tsx` — remover imports não usados: `Group`, `Panel`, `Button`,
      `UserSideBar`, `InputText`, `Star`, `Plus`, `Settings`
- [ ] `page.tsx:8` — remover `Group, Panel, Separator`, importados e nunca usados
- [ ] `layout.tsx:16-17` — metadata ainda é "Create Next App"

---

## Critério de conclusão da Fase 1

- [x] `npx tsc --noEmit` limpo
- [x] `npm run lint` limpo
- [x] `npm run build` passa
- [ ] Criar, selecionar e editar nota funciona ponta a ponta em memória
      — **falta validar clicando no navegador.** O que foi verificado até aqui:
      `build` passa, a página responde 200 e o SSR já renderiza sidebar, lista e
      editor, sem erro no log do dev server. O fluxo de clique é client-side e não
      foi exercitado.
- [x] Nenhum import de `@mui/*` restante
- [x] Zero classe Tailwind apontando para token inexistente
- [x] Estrutura por feature no lugar

---

## Desvios e decisões tomadas durante a execução

**`Note.content` virou `JSONContent` já nesta fase**, em vez de `string`. O roadmap
exige JSON do TipTap, e deixar `string` agora só criaria uma migração boba depois.
`features/notes/utils.ts` ganhou `emptyDoc`, `docFromText` e `extractPlainText` —
esta última é a semente da coluna `plainText` da fase 2.

**`src/lib/id.ts` foi criado antes da hora.** É item da fase 2, mas centralizar a
geração de ID desde já significa que trocar para UUID v7 mexe em um arquivo só. Por
enquanto usa `crypto.randomUUID()` (v4).

**`NavSidebar` é renderizado pela `page.tsx`, não pelo `(app)/layout.tsx`.** O botão
"Nova nota" precisa do `createNote`, que vive no `useNotes` da página. Na fase 2, com
TanStack Query, a mutação fica acessível de qualquer lugar e a sidebar sobe para o
layout — que hoje contém só o `SidebarProvider`.

**`app/(marketing)/` não foi criado.** Não existe conteúdo público ainda; nasce na
fase 2 junto com login e signup.

**Botão de link fica desabilitado** até a fase 5, com `title="Link (em breve)"`.
`toggleLink()` sem `href` não faz nada, e um botão que não responde é pior que um
botão visivelmente indisponível.

**Vocabulário de cor unificado nos tokens semânticos do shadcn.** As famílias
`bg-base` / `notes-*` / `buttons-*` foram removidas por inteiro, e a paleta `.dark`
foi reescrita para o tom quente do mockup (fundo neutro escuro, acento âmbar). Um
`text-white` hardcoded virou `text-foreground`.

**Correções fora do escopo original**, encontradas durante a execução:

- `@base-ui/react` e `class-variance-authority` estavam em `devDependencies` mas são
  usados em runtime pelos componentes shadcn — movidos para `dependencies`
- coexistiam `package-lock.json` e `yarn.lock`; o `yarn.lock` foi removido (o README
  usa npm) para evitar instalação divergente entre máquinas
- adicionado script `typecheck`
- `zustand` adicionado como dependência
