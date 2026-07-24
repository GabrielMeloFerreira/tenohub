# Fase 3 — Sync e Offline

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

## 3.5 Resolução de conflito

Estratégia inicial: **last-write-wins por nota**, comparando `updatedAt`.

- [ ] Cliente envia o `updatedAt` que ele conhece
- [ ] Servidor compara antes de gravar
- [ ] Se o do servidor for mais novo, **não sobrescreva silenciosamente** — devolva o
      conflito e deixe o usuário escolher

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

- [ ] `sincronizado` — fila vazia, online
- [ ] `salvando` — mutação em voo
- [ ] `offline` — sem rede, N alterações pendentes
- [ ] `erro` — falhou após todos os retries, com ação de tentar de novo

- [ ] `useOnlineStatus()` em `src/lib/`
- [ ] Contador de mutações pendentes via `useIsMutating()`

Esse indicador não é enfeite: sem ele, o usuário não sabe se pode fechar a aba. É o que
transforma "parece que salvou" em confiança.

---

## 3.7 PWA (opcional, mas barato)

- [ ] `manifest.json` e ícones
- [ ] Service worker para o app shell
- [ ] Instalável em desktop e mobile

Sem isso, "offline" só funciona com a aba já aberta. Com isso, o app abre do zero sem
rede — que é o que as pessoas entendem por offline.

---

## Critério de conclusão da Fase 3

- Modo avião: abrir o app, ler, criar, editar
- Voltar a rede: tudo sincroniza sozinho, sem duplicata
- Fechar a aba com alterações pendentes e reabrir: as alterações ainda sobem
- Indicador de status refletindo o estado real
- Editar em dois dispositivos com rede: os dois convergem
