export const queryKeys = {
  notes: {
    all: ['notes'] as const,
    list: () => ['notes', 'list'] as const,
  },
  folders: {
    all: ['folders'] as const,
    list: () => ['folders', 'list'] as const,
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
}
