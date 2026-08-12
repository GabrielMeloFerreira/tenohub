'use client'

import { useCallback, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { newId } from '@/lib/id'
import { mutationKeys, queryKeys } from '@/lib/query-keys'
import type { AddTagToNoteVars, RemoveTagFromNoteVars } from '../query'
import * as actions from '../server/actions'
import type { NoteTagLink, Tag } from '../types'

function normalizeName(raw: string): string {
  return raw.trim().replace(/^#/, '').trim()
}

export function useTags(initialTags: Tag[], initialLinks: NoteTagLink[]) {
  const { data: tags = [] } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => actions.listTags(),
    initialData: initialTags,
  })

  const { data: links = [] } = useQuery({
    queryKey: queryKeys.tags.links(),
    queryFn: () => actions.listNoteTagLinks(),
    initialData: initialLinks,
  })

  const addMut = useMutation<void, Error, AddTagToNoteVars>({
    mutationKey: mutationKeys.tags.addToNote,
  })
  const removeMut = useMutation<void, Error, RemoveTagFromNoteVars>({
    mutationKey: mutationKeys.tags.removeFromNote,
  })

  const tagsByNoteId = useMemo(() => {
    const map = new Map<string, Tag[]>()
    const tagMap = new Map(tags.map((t) => [t.id, t]))

    for (const link of links) {
      const tag = tagMap.get(link.tagId)
      if (!tag) continue
      const list = map.get(link.noteId) ?? []
      list.push(tag)
      map.set(link.noteId, list)
    }

    for (const [noteId, list] of map) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      map.set(noteId, list)
    }

    return map
  }, [tags, links])

  const getTagsForNote = useCallback(
    (noteId: string) => tagsByNoteId.get(noteId) ?? [],
    [tagsByNoteId]
  )

  const addTagToNote = useCallback(
    (noteId: string, rawName: string) => {
      const name = normalizeName(rawName)
      if (!name) return false

      const existingOnNote = getTagsForNote(noteId)
      if (existingOnNote.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
        return false
      }

      const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase())
      addMut.mutate({
        noteId,
        tagId: existing?.id ?? newId(),
        name: existing?.name ?? name,
      })
      return true
    },
    [addMut, getTagsForNote, tags]
  )

  const removeTagFromNote = useCallback(
    (noteId: string, tagId: string) => {
      removeMut.mutate({ noteId, tagId })
    },
    [removeMut]
  )

  /** Tags do usuário que ainda não estão na nota (para sugestões). */
  const suggestionsForNote = useCallback(
    (noteId: string, query: string) => {
      const onNote = new Set(getTagsForNote(noteId).map((t) => t.id))
      const q = normalizeName(query).toLowerCase()
      return tags
        .filter((t) => !onNote.has(t.id))
        .filter((t) => !q || t.name.toLowerCase().includes(q))
        .slice(0, 8)
    },
    [getTagsForNote, tags]
  )

  return {
    tags,
    getTagsForNote,
    addTagToNote,
    removeTagFromNote,
    suggestionsForNote,
  }
}
