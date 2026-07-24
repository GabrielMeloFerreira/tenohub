import { create } from 'zustand'

export type View = 'notes' | 'todo' | 'calendar' | 'settings' | 'search'

type UiState = {
  view: View
  selectedNoteId: string | null
  setView: (view: View) => void
  selectNote: (id: string | null) => void
}

/** Estado puramente de interface. Nada que venha do servidor mora aqui. */
export const useUiStore = create<UiState>((set) => ({
  view: 'notes',
  selectedNoteId: null,
  setView: (view) => set({ view }),
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
}))
