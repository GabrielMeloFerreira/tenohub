# Fase 3 — Sync e Offline

> **Status: núcleo implementado (27/07/2026).** 3.1–3.4 e 3.6 prontos, build verde.
> 3.5 (conflito) e 3.7 (PWA) **adiados de propósito** — ver **Estado da execução** no
> fim. Falta a verificação em navegador com modo avião (roteiro no fim do documento).

**Objetivo:** app utilizável sem internet. Ler notas offline, criar e editar offline, e
sincronizar sozinho quando a rede voltar.

**Pré-requisito:** Fase 2 concluída, com IDs gerados no cliente (2.4). Sem isso esta
fase não é possível.

---

## O modelo

Servidor é a autoridade. O cliente trabalha sobre um cache local e é otimista.

```
usuário digita
  → UI atualiza na hora (cache local)
  → debounce ~800ms
  → mutação entra na fila
  → fila drena quando há rede
  → servidor confirma, cache reconcilia
```

Online, a fila drena em milissegundos e ninguém percebe que ela existe. Offline, ela
acumula. **É o mesmo caminho de código nos dois casos** — não existe "modo offline"
separado para manter, e é justamente por isso que essa abordagem é sustentável sozinho.

---

## 3.1 TanStack Query

- [ ] Instalar `@tanstack/react-query` e `@tanstack/react-query-devtools`
- [ ] `QueryClientProvider` no layout de `(app)`
- [ ] Convenção de query keys em `src/lib/query-keys.ts`:

```ts
notes: {
  all:    ['notes'],
  list:   (filtros) => ['notes', 'list', filtros],
  detail: (id)      => ['notes', 'detail', id],
}
```

- [ ] `staleTime` alto (5min+). Nota é dado de dono único — não muda por trás de você
      como um feed. Refetch agressivo aqui só gasta bateria e banda.

---

## 3.2 Persistir o cache em IndexedDB

Isso é o que dá **leitura offline**.

- [ ] Instalar `@tanstack/query-sync-storage-persister` (ou o async, para IndexedDB) e
      `@tanstack/react-query-persist-client`
- [ ] Instalar `idb-keyval` como backend de storage
- [ ] Trocar `QueryClientProvider` por `PersistQueryClientProvider`
- [ ] `maxAge` de 30 dias
- [ ] **`buster` com a versão do schema** — quando o formato dos dados mudar, o cache
      antigo precisa ser invalidado, ou usuários voltam com dados em formato velho e
      você depura um fantasma

> Não use `localStorage`: limite de ~5MB e API síncrona que trava a thread principal.
> IndexedDB é assíncrono e comporta bem mais.

**Pronto quando:** carregar o app, ativar modo avião, recarregar — as notas ainda
aparecem.

---

## 3.3 Fila de mutações

Isso é o que dá **escrita offline**.

- [ ] Usar `queryClient.setMutationDefaults` com `mutationKey` por tipo de operação
- [ ] Habilitar `persistQueryClient` para mutações pausadas
- [ ] No boot do app: `queryClient.resumePausedMutations()`
- [ ] Escutar o evento `online` do navegador e drenar a fila
- [ ] `retry` com backoff exponencial, teto de ~5 tentativas

Cada mutação precisa ser **idempotente**: o `id` vem do cliente, então reenviar um
`createNote` deve virar upsert, não uma segunda nota. Isso importa porque retry sem
idempotência é como se duplica dado do usuário — e nota duplicada é o tipo de bug que
faz a pessoa desinstalar.

- [ ] `createNote` no servidor vira `INSERT ... ON CONFLICT (id) DO UPDATE`

**Pronto quando:** modo avião → criar duas notas e editar uma terceira → voltar a rede
→ tudo sobe sozinho, sem duplicar nada.

---

## 3.4 Updates otimistas no editor

- [ ] `onMutate` escreve no cache antes da resposta do servidor
- [ ] `onError` faz rollback para o snapshot anterior
- [ ] `onSettled` invalida a query
- [ ] Debounce de ~800ms no `onUpdate` do TipTap — **nunca salvar a cada tecla**
- [ ] Salvar imediatamente em `blur` e ao trocar de nota, sem esperar o debounce

---

## 3.5 Resolução de conflito — ADIADO DE PROPÓSITO

Estratégia inicial pensada: **last-write-wins por nota**, comparando `updatedAt`.

- [ ] ~~Cliente envia o `updatedAt` que ele conhece~~
- [ ] ~~Servidor compara antes de gravar~~
- [ ] ~~Se o do servidor for mais novo, devolve o conflito~~

**Por que foi adiado (decisão de 27/07/2026):** detecção por `updatedAt` é incompatível
com o design otimista desta fase. O cliente escreve `updatedAt = new Date()` a cada tecla
e nunca reconcilia com o timestamp que o servidor gravou (não fazemos refetch pós-save,
para não atropelar quem digita). Logo os dois relógios sempre divergem, e uma comparação
ingênua dispararia "conflito" em **edição normal de um único dispositivo** — um bug
visível, pior que o problema que resolve.

Fazer certo exige coluna `version`, o cliente rastreando a versão devolvida pelo servidor
a cada escrita, e serializar as mutations por nota (`scope`). É viável, mas o caminho
concorrente **não é verificável sem dois dispositivos/sessões**, e o cenário (mesmo
usuário, duas telas, mesma nota, uma offline) é raríssimo em MVP single-user.

O LWW atual (a última escrita que chega ao servidor vence) cobre o caso comum.

**Direção definida (28/07/2026): modelo Notion, sem Yjs.** Quando a 3.5 for retomada, o
alvo é **LWW por bloco/campo** (granularidade fina, como o Notion), NÃO CRDT. O Gabriel
descartou Yjs de propósito: colaboração offline simultânea no mesmo item é caso raríssimo
para um app de notas, e não justifica a complexidade do CRDT. Isso mantém o modelo
inteiro como servidor-autoritativo + fila de operações + última-escrita-vence — só que a
unidade de conflito passa de "nota inteira" para "bloco/campo".

Implicação a lembrar: hoje o `content` é um blob `jsonb` sincronizado como unidade. O
modelo Notion exige sincronizar em granularidade de bloco (operações por nó do
ProseMirror, ou blocos como linhas separadas). Essa é a mudança de fundo da 3.5 — não é
trivial, mas é MUITO menor que CRDT, e o `content` já ser TipTap/ProseMirror (block-based)
ajuda. Para single-user, o LWW por nota atual provavelmente basta por um bom tempo.

**Limitação, e é bom ser honesto sobre ela:** se a mesma nota for editada em dois
dispositivos offline simultaneamente, uma das versões perde. Para uso pessoal e single
user isso é raríssimo. Quando virar problema real — colaboração, ou você mesmo
esbarrando nisso com frequência — a resposta é Yjs, e ela entra **apenas no campo
`content`**. Nada do que está nesta fase precisa ser refeito.

Sugestão de segurança barata: ao detectar conflito, salve a versão perdedora como nota
nova ("Cópia em conflito — 24/07"). Dado do usuário nunca deve sumir sem ele ver.

---

## 3.6 Indicador de status

O mockup tem "Sincronizado · 4 dispositivos" no rodapé. Estados a cobrir:

- [x] `sincronizado` — fila vazia, online
- [x] `salvando` — mutação em voo
- [x] `offline` — sem rede, N alterações pendentes
- [ ] `erro` — falhou após todos os retries, com ação de tentar de novo
      (retry com backoff existe; o estado visual de erro final ainda não)

- [x] `useOnlineStatus()` em `src/lib/`
- [x] Contador de mutações pendentes via `useIsMutating()`

Esse indicador não é enfeite: sem ele, o usuário não sabe se pode fechar a aba. É o que
transforma "parece que salvou" em confiança.

---

## 3.7 PWA — ADIADO (decidir se entra agora)

- [ ] `manifest.json` e ícones
- [ ] Service worker para o app shell
- [ ] Instalável em desktop e mobile

Sem isso, "offline" só funciona com a aba já aberta. Com isso, o app abre do zero sem
rede — que é o que as pessoas entendem por offline.

**Situação:** adiado, mas é o item que mais muda a percepção de "offline" para o Gabriel,
que quer offline de verdade. Recarregar a página sem rede hoje falha no fetch do HTML
(Next busca do servidor); só o service worker resolve isso. Candidato a ser o próximo
bloco de trabalho, separado, se ele quiser.

---

## Critério de conclusão da Fase 3

- [x] `tsc`, `lint`, `build` verdes
- [x] Escrita otimista com debounce; save no blur/troca de nota
- [x] Cache persistido em IndexedDB (superjson preserva Date); fila de mutações
- [x] `createNote` idempotente (upsert) — retry não duplica
- [x] Indicador de status refletindo online/salvando/offline
- [x] **Verificado em navegador (28/07/2026)**: wifi desligado → edições → wifi religado
      → alterações subiram sozinhas. Fila de mutações drenando ao reconectar confirmada.
- [~] Conflito entre dois dispositivos: adiado (3.5), LWW por ora
- [~] Cold-start offline (reload sem rede): depende da 3.7 (PWA), adiada

---

## Estado da execução (27/07/2026)

### Implementado (commits A–C)

- **A** `098ec94` — TanStack Query como camada de dados; `useNotes` sobre
  useQuery/useMutation; `createNote` vira upsert; `listNotes` server action.
- **B** `741622c` — cache em IndexedDB (idb-keyval + superjson); mutations pausadas
  resumem no boot; drain ao reconectar pelo `onlineManager`.
- **C** `f1c2e0f` — `flushNote` (save no blur e ao trocar de nota); `SyncStatus`.

### Verificado

Só `tsc`/`lint`/`build`. O código novo roda na árvore autenticada e envolve
IndexedDB + eventos de rede — nada disso é exercitável por script. **A verificação
real é no navegador**, abaixo.

### NÃO verificado — roteiro para o Gabriel

Com `npm run dev`, logado, DevTools aberto (aba Network):

1. **Escrita otimista + save**: criar nota, digitar título e corpo. O `SyncStatus`
   (canto inferior direito) deve piscar "Salvando…" e voltar a "Sincronizado".
   Recarregar → conteúdo persistiu.
2. **Offline dentro da sessão**: Network → "Offline". Criar duas notas, editar uma
   terceira. O status deve mostrar "Offline · N pendentes". Nada de erro.
3. **Drain ao voltar**: Network → "Online" (ou "No throttling"). Em segundos o status
   volta a "Sincronizado" e as mutações sobem. Conferir no Supabase que as notas
   chegaram, **sem duplicatas** (é o teste do upsert idempotente).
4. **Fila sobrevive a reload**: repetir o passo 2 (offline, criar/editar), e **com a
   aba ainda offline, dar F5**. Como não há service worker (3.7), o reload offline
   provavelmente falha ao carregar o HTML — esperado. Alternativa: criar offline,
   voltar online, e antes do drain terminar dar reload; as mutações persistidas devem
   retomar e subir.

Se algo em 1–3 falhar, me manda o que o `SyncStatus` mostrou e o que apareceu no
Network — são os dois sinais que apontam a causa.

### Adiado de propósito

- **3.5 conflito** — incompatível com o design otimista sem coluna `version` +
  reconciliação; risco de falso-positivo em edição normal. LWW por ora; Yjs no futuro.
- **3.7 PWA** — service worker para cold-start offline. Maior ganho de percepção;
  candidato ao próximo bloco.
- **Estado visual de erro final** no `SyncStatus` (após esgotar os 5 retries).
