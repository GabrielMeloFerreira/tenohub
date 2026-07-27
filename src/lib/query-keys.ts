/** Chaves de query e mutation centralizadas. Evita string solta espalhada pelo código. */
export const queryKeys = {
  notes: {
    all: ['notes'] as const,
    // Filtros (pasta, tag, ordenação) entram na fase 4.
    list: () => ['notes', 'list'] as const,
  },
}

/** Chaves de mutation. Precisam ser estáveis: a fila offline resume por chave. */
export const mutationKeys = {
  notes: {
    create: ['notes', 'create'] as const,
    update: ['notes', 'update'] as const,
    delete: ['notes', 'delete'] as const,
  },
}
