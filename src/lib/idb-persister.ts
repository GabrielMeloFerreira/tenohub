import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { del, get, set } from 'idb-keyval'
import superjson from 'superjson'

/*
 * Persister do cache do TanStack Query em IndexedDB.
 *
 * - idb-keyval (get/set/del) adaptado para a interface AsyncStorage (getItem/...).
 * - superjson na serializacao: o default do persister e JSON, que transforma Date em
 *   string. As notas tem createdAt/updatedAt como Date; superjson preserva o tipo.
 */
const KEY = 'tenohub-query-cache'

export function createIdbPersister() {
  return createAsyncStoragePersister({
    key: KEY,
    storage: {
      getItem: (key) => get(key),
      setItem: (key, value) => set(key, value),
      removeItem: (key) => del(key),
    },
    serialize: superjson.stringify,
    deserialize: superjson.parse,
  })
}
