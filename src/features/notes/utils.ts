import type { JSONContent } from '@tiptap/react'

/** Documento vazio do TipTap — o estado inicial de uma nota nova. */
export function emptyDoc(): JSONContent {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

/** Monta um documento simples a partir de texto puro. Usado só pelos mocks. */
export function docFromText(text: string): JSONContent {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  }
}

/**
 * Extrai texto puro do documento do TipTap.
 *
 * Na fase 2 isso passa a ser calculado ao salvar e persistido na coluna `plainText`,
 * que alimenta a busca full-text. Aqui roda no cliente só para o preview do card.
 */
export function extractPlainText(doc: JSONContent | undefined): string {
  if (!doc) return ''

  let out = ''
  const walk = (node: JSONContent) => {
    if (node.text) out += node.text
    node.content?.forEach(walk)
    // blocos viram separador para "a.b" não colar como "ab"
    if (node.type === 'paragraph' || node.type === 'heading') out += ' '
  }
  walk(doc)

  return out.replace(/\s+/g, ' ').trim()
}

export function countWords(text: string): number {
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}
