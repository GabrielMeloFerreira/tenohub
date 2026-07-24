import type { Note } from './types'
import { docFromText } from './utils'

/** Seed de desenvolvimento. Sai na fase 2, quando o Postgres entra. */
export const mockNotes: Note[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Q4 — Estratégia de relançamento',
    content: docFromText(
      'Antes de dezembro a gente precisa reposicionar o produto para um público que entende valor, mas não tem paciência com onboarding mal feito.'
    ),
    createdAt: new Date('2026-05-14T10:00:00'),
    updatedAt: new Date('2026-07-24T09:12:00'),
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Reunião com a Carla — kickoff',
    content: docFromText(
      'Definir escopo do redesign, próximas 2 sprints. Carla traz o documento de requisitos na quinta.'
    ),
    createdAt: new Date('2026-07-22T14:30:00'),
    updatedAt: new Date('2026-07-23T16:45:00'),
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Ideias soltas — feature toggles',
    content: docFromText(
      'Pensar num sistema de feature flags por workspace, não por user. Talvez começar pelo plano Pro.'
    ),
    createdAt: new Date('2026-07-18T08:00:00'),
    updatedAt: new Date('2026-07-18T08:20:00'),
  },
]
