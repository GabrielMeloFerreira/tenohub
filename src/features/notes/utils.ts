import type { JSONContent } from '@tiptap/react'

/** Documento inicial: título (1º bloco) + corpo clicável (2º bloco). */
export function emptyDoc(): JSONContent {
  return {
    type: 'doc',
    content: [{ type: 'paragraph' }, { type: 'paragraph' }],
  }
}

function isEmptyBlock(node: JSONContent | undefined): boolean {
  if (!node) return true
  if (node.text) return node.text.trim().length === 0
  if (!node.content?.length) return true
  return node.content.every(isEmptyBlock)
}

/**
 * Garante título + pelo menos um parágrafo de corpo quando a nota está vazia,
 * para o placeholder do corpo aparecer e ser clicável.
 */
export function ensureTitleBodyDoc(doc: JSONContent | undefined): JSONContent {
  if (!doc?.content?.length) return emptyDoc()

  const first = doc.content[0]
  const rest = doc.content.slice(1)
  const onlyEmptyTitle = isEmptyBlock(first) && rest.every(isEmptyBlock)

  if (onlyEmptyTitle && rest.length === 0) {
    return {
      type: 'doc',
      content: [first ?? { type: 'paragraph' }, { type: 'paragraph' }],
    }
  }

  return doc
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

export function countChars(text: string): number {
  return text.length
}

const MONTHS_PT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

/** Data curta no estilo do mock: "14 mai". */
export function formatShortDate(value: Date | string): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`
}

/** Tempo relativo em PT: "agora", "há 12 min", "há 3 h", "há 2 d". */
export function formatRelativePast(value: Date | string): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''

  const diffMs = Date.now() - d.getTime()
  if (diffMs < 0) return 'agora'

  const sec = Math.floor(diffMs / 1000)
  if (sec < 45) return 'agora'

  const min = Math.floor(sec / 60)
  if (min < 60) return `há ${min} min`

  const hours = Math.floor(min / 60)
  if (hours < 24) return `há ${hours} h`

  const days = Math.floor(hours / 24)
  if (days < 7) return `há ${days} d`

  return formatShortDate(d)
}

/** Formata inteiro com separador de milhar BR: 1840 → "1.840". */
export function formatCount(n: number): string {
  return n.toLocaleString('pt-BR')
}
