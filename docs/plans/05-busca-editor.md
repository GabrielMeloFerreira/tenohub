# Fase 5 — Busca e Editor

**Objetivo:** as duas coisas que fazem alguém trocar de app de notas. Busca instantânea
e um editor gostoso de usar.

**Pré-requisito:** Fase 4 concluída.

---

## 5.1 Busca

O mockup tem "Buscar em tudo… ⌘K" no topo da sidebar.

### Servidor

- [ ] Coluna `searchVector tsvector` gerada a partir de `title` + `plainText`
- [ ] Índice GIN sobre ela
- [ ] Trigger mantendo o vector atualizado no `INSERT`/`UPDATE` — ou coluna gerada, se
      o Postgres do Supabase suportar `GENERATED ALWAYS`
- [ ] Configuração `portuguese` **e** `english` — o app é bilíngue e stemming errado
      degrada resultado de forma silenciosa
- [ ] `ts_rank` para ordenar
- [ ] `ts_headline` para o trecho com o termo destacado

Full-text nativo do Postgres resolve milhares de notas por usuário com folga e custa
zero. Só considere Typesense/Meilisearch se um dia a busca ficar realmente lenta —
provavelmente nunca.

### Cliente

- [ ] Command palette (⌘K / Ctrl+K) — `cmdk` ou o `Command` do shadcn
- [ ] Debounce de ~200ms
- [ ] Busca também offline, sobre o cache local — degradada mas presente
- [ ] Resultado com título, trecho destacado, pasta e data
- [ ] Navegação por teclado (↑ ↓ Enter Esc)
- [ ] Ações rápidas na mesma palette: nova nota, ir para pasta, alternar tema

> Se o ⌘K estiver bom, ele vira o modo principal de navegar no app e a sidebar vira
> secundária. Vale investir aqui mais do que parece razoável.

---

## 5.2 Editor — blocos

O mockup mostra H1 serifado, parágrafo, e um callout com 💡 "Decisão tomada".

- [ ] Headings 1–3 com a tipografia do mockup
- [ ] Listas com marcador, numerada e de tarefas (`@tiptap/extension-task-list`)
- [ ] Citação
- [ ] Bloco de código com highlight (`@tiptap/extension-code-block-lowlight`)
- [ ] Linha divisória
- [ ] **Callout** — extensão custom (Node com `content: 'block+'`), variantes info /
      atenção / sucesso / destaque. Não existe pronta no TipTap
- [ ] Tabela (`@tiptap/extension-table`)

---

## 5.3 Slash commands

- [ ] Digitar `/` abre menu de blocos
- [ ] Filtrar digitando
- [ ] Navegação por teclado
- [ ] `@tiptap/suggestion` é a base

---

## 5.4 Link

Retomando o que o `LinkPop.tsx` deletado na fase 1 tentava fazer.

- [ ] Instalar `@tiptap/extension-link`
- [ ] Popover ao selecionar texto e clicar no botão de link
- [ ] Colar URL sobre texto selecionado vira link direto
- [ ] Editar e remover link no popover
- [ ] `rel="noopener noreferrer"` e validação de protocolo — **bloquear `javascript:`**,
      que é vetor de XSS clássico em editor rico

---

## 5.5 Bubble menu

- [ ] Selecionar texto → menu flutuante com negrito, itálico, link, código, cor
- [ ] `BubbleMenu` do `@tiptap/react`

---

## 5.6 Metadados do editor

O mockup mostra "Editado há 12 min", "Criado em 14 mai", tags no cabeçalho, e
"312 palavras · 1.840 caracteres" no rodapé.

- [ ] Cabeçalho com criação, edição relativa e tags
- [ ] Breadcrumb "Trabalho › Q4 › Estratégia de relançamento"
- [ ] Rodapé com contagem de palavras e caracteres (`@tiptap/extension-character-count`)
- [ ] Persistir `wordCount` no banco — o card e futuras estatísticas usam

---

## 5.7 Atalhos

- [ ] ⌘K busca · ⌘N nova nota · ⌘S salvar agora · ⌘B / ⌘I / ⌘U formatação
- [ ] ⌘\ alternar sidebar · Esc fecha overlays
- [ ] Modal de atalhos com `?`
- [ ] Usar `event.key`, **não** `keyCode`, e testar em teclado ABNT2

---

## 5.8 Polimento visual

Alinhar com o mockup:

- [ ] Fonte serifada nos títulos e no H1 do editor (o mockup usa serifada com itálico
      no acento) — via `next/font`
- [ ] Cor de acento quente (laranja/âmbar) como `--color-accent`
- [ ] Card selecionado com borda de acento
- [ ] Largura de leitura confortável no editor (~65–75 caracteres)
- [ ] Estados vazios desenhados (sem notas, busca sem resultado, lixeira vazia)
- [ ] Skeleton no carregamento (`ui/skeleton.tsx` já existe)
- [ ] Toggle claro/escuro no rodapé, com preferência persistida

---

## Critério de conclusão da Fase 5

- ⌘K acha nota por conteúdo, com destaque, em menos de 100ms
- Slash commands inserindo todos os blocos
- Callout do mockup reproduzido
- Contagem de palavras batendo
- App visualmente próximo do mockup
- **Você consegue usar como app de notas principal por uma semana sem sentir falta**

---

## Depois desta fase

Antes de partir para billing (fase 6): **use o app todo dia, por duas semanas.**

É o passo mais valioso do roadmap inteiro e o mais fácil de pular. Você vai encontrar
atrito que nenhum planejamento antecipa, features do plano que não fazem falta nenhuma,
e detalhes bobos que viram prioridade. Cobrar por algo que você mesmo ainda não usa
diariamente é a forma mais rápida de construir a coisa errada com capricho.
