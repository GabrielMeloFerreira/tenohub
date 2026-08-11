import type { JSONContent } from '@tiptap/react'

export function emptyDoc(): JSONContent {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

export function docFromText(text: string): JSONContent {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  }
}

function collectText(node: JSONContent): string {
  if (node.text) return node.text
  return (node.content ?? []).map(collectText).join(' ')
}

export function extractPlainText(doc: JSONContent | undefined): string {
  if (!doc?.content) return ''
  return doc.content
    .map(collectText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function titleFromDoc(doc: JSONContent | undefined): string {
  const first = doc?.content?.[0]
  if (!first) return ''
  return collectText(first).replace(/\s+/g, ' ').trim().slice(0, 200)
}

export function previewFromDoc(doc: JSONContent | undefined): string {
  const rest = doc?.content?.slice(1) ?? []
  return rest
    .map(collectText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function countWords(text: string): number {
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}
