'use client'

import { useCallback } from 'react'
import type { JSONContent } from '@tiptap/react'

import NavSidebar from '@/components/layout/NavSidebar'
import FolderList from '@/features/folders/components/FolderList'
import { useFolders } from '@/features/folders/hooks/useFolders'
import type { FolderWithCount } from '@/features/folders/types'
import { useUiStore } from '@/stores/ui-store'
import { useNotes } from '../hooks/useNotes'
import { titleFromDoc } from '../utils'
import type { Note } from '../types'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'
import SyncStatus from './SyncStatus'

interface NotesWorkspaceProps {
  initialNotes: Note[]
  initialFolders: FolderWithCount[]
  user: { name: string; email: string }
}

export default function NotesWorkspace({
  initialNotes,
  initialFolders,
  user,
}: NotesWorkspaceProps) {
  const { notes, createNote, updateNote, moveNote, flushNote } = useNotes(initialNotes)
  const { folders, createFolder, renameFolder, deleteFolder } = useFolders(initialFolders)

  const view = useUiStore((s) => s.view)
  const selectedNoteId = useUiStore((s) => s.selectedNoteId)
  const selectedFolderId = useUiStore((s) => s.selectedFolderId)
  const setView = useUiStore((s) => s.setView)
  const selectNote = useUiStore((s) => s.selectNote)
  const setSelectedFolder = useUiStore((s) => s.setSelectedFolder)

  const visibleNotes = selectedFolderId
    ? notes.filter((n) => n.folderId === selectedFolderId)
    : notes
  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null

  const handleSelectNote = useCallback(
    (id: string) => {
      flushNote(selectedNoteId)
      selectNote(id)
    },
    [flushNote, selectedNoteId, selectNote]
  )

  const handleSelectFolder = useCallback(
    (id: string) => {
      setSelectedFolder(id)
      setView('notes')
    },
    [setSelectedFolder, setView]
  )

  const handleShowAllNotes = useCallback(() => {
    setSelectedFolder(null)
    setView('notes')
  }, [setSelectedFolder, setView])

  const handleCreateNote = useCallback(() => {
    flushNote(selectedNoteId)
    const note = createNote()
    selectNote(note.id)
    setView('notes')
  }, [flushNote, selectedNoteId, createNote, selectNote, setView])

  const handleMoveNote = useCallback(
    (folderId: string | null) => {
      if (selectedNoteId) moveNote(selectedNoteId, folderId)
    },
    [selectedNoteId, moveNote]
  )

  const handleFlush = useCallback(() => flushNote(selectedNoteId), [flushNote, selectedNoteId])

  const handleChangeContent = useCallback(
    (content: JSONContent) => {
      if (selectedNoteId) updateNote(selectedNoteId, { content, title: titleFromDoc(content) })
    },
    [selectedNoteId, updateNote]
  )

  return (
    <>
      <NavSidebar
        view={view}
        user={user}
        notesActive={view === 'notes' && !selectedFolderId}
        folders={
          <FolderList
            folders={folders}
            selectedId={selectedFolderId}
            onCreate={createFolder}
            onRename={renameFolder}
            onDelete={deleteFolder}
            onSelect={handleSelectFolder}
          />
        }
        onChangeView={setView}
        onShowAllNotes={handleShowAllNotes}
        onCreateNote={handleCreateNote}
      />

      {view === 'notes' ? (
        <div className="relative flex min-w-0 flex-1 overflow-hidden">
          <NoteList
            notes={visibleNotes}
            selectedId={selectedNoteId}
            username={user.name}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
          />
          <NoteEditor
            note={selectedNote}
            folders={folders}
            onChangeContent={handleChangeContent}
            onMove={handleMoveNote}
            onFlush={handleFlush}
          />
          <SyncStatus />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Em breve.
        </div>
      )}
    </>
  )
}
