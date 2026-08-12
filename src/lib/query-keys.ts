export const queryKeys = {
  notes: {
    all: ['notes'] as const,
    list: () => ['notes', 'list'] as const,
  },
  folders: {
    all: ['folders'] as const,
    list: () => ['folders', 'list'] as const,
  },
  tags: {
    all: ['tags'] as const,
    list: () => ['tags', 'list'] as const,
    links: () => ['tags', 'links'] as const,
  },
}

export const mutationKeys = {
  notes: {
    create: ['notes', 'create'] as const,
    update: ['notes', 'update'] as const,
    move: ['notes', 'move'] as const,
    delete: ['notes', 'delete'] as const,
  },
  folders: {
    create: ['folders', 'create'] as const,
    rename: ['folders', 'rename'] as const,
    delete: ['folders', 'delete'] as const,
  },
  tags: {
    addToNote: ['tags', 'addToNote'] as const,
    removeFromNote: ['tags', 'removeFromNote'] as const,
  },
}
