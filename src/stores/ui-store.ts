import { create } from 'zustand'

export type View = 'notes' | 'todo' | 'calendar' | 'settings' | 'search'

type UiState = {
  view: View
  selectedNoteId: string | null
  selectedFolderId: string | null
  setView: (view: View) => void
  selectNote: (id: string | null) => void
  setSelectedFolder: (id: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  view: 'notes',
  selectedNoteId: null,
  selectedFolderId: null,
  setView: (view) => set({ view }),
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
  setSelectedFolder: (selectedFolderId) => set({ selectedFolderId }),
}))
