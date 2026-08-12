import type { QueryClient } from '@tanstack/react-query'

import { mutationKeys, queryKeys } from '@/lib/query-keys'
import * as tagActions from './server/actions'
import type { NoteTagLink, Tag } from './types'

export type AddTagToNoteVars = { noteId: string; tagId: string; name: string }
export type RemoveTagFromNoteVars = { noteId: string; tagId: string }

const tagsKey = queryKeys.tags.list()
const linksKey = queryKeys.tags.links()

const getTags = (qc: QueryClient) => qc.getQueryData<Tag[]>(tagsKey) ?? []
const getLinks = (qc: QueryClient) => qc.getQueryData<NoteTagLink[]>(linksKey) ?? []

export function registerTagMutations(qc: QueryClient) {
  qc.setMutationDefaults(mutationKeys.tags.addToNote, {
    mutationFn: (vars: AddTagToNoteVars) => tagActions.addTagToNote(vars),
    onMutate: async (vars: AddTagToNoteVars) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: tagsKey }),
        qc.cancelQueries({ queryKey: linksKey }),
      ])

      const prevTags = getTags(qc)
      const prevLinks = getLinks(qc)

      const nameKey = vars.name.toLowerCase()
      const existing = prevTags.find((t) => t.name.toLowerCase() === nameKey)
      const tagId = existing?.id ?? vars.tagId
      const tag: Tag = existing ?? {
        id: tagId,
        userId: '',
        name: vars.name,
      }

      if (!existing) {
        qc.setQueryData<Tag[]>(
          tagsKey,
          [...prevTags, tag].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        )
      }

      const alreadyLinked = prevLinks.some((l) => l.noteId === vars.noteId && l.tagId === tagId)
      if (!alreadyLinked) {
        qc.setQueryData<NoteTagLink[]>(linksKey, [...prevLinks, { noteId: vars.noteId, tagId }])
      }

      return { prevTags, prevLinks }
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return
      qc.setQueryData(tagsKey, ctx.prevTags)
      qc.setQueryData(linksKey, ctx.prevLinks)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tagsKey })
      qc.invalidateQueries({ queryKey: linksKey })
    },
  })

  qc.setMutationDefaults(mutationKeys.tags.removeFromNote, {
    mutationFn: (vars: RemoveTagFromNoteVars) => tagActions.removeTagFromNote(vars),
    onMutate: async (vars: RemoveTagFromNoteVars) => {
      await qc.cancelQueries({ queryKey: linksKey })
      const prevLinks = getLinks(qc)
      qc.setQueryData<NoteTagLink[]>(
        linksKey,
        prevLinks.filter((l) => !(l.noteId === vars.noteId && l.tagId === vars.tagId))
      )
      return { prevLinks }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prevLinks) qc.setQueryData(linksKey, ctx.prevLinks)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: linksKey })
    },
  })
}
