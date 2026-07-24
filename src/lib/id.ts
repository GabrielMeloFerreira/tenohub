import { uuidv7 } from 'uuidv7'

/**
 * Geração de IDs no cliente.
 *
 * UUID v7 — ordenável por tempo, então inserções ficam sequenciais no índice em vez de
 * espalhadas. O ID sempre nasce aqui, nunca no banco: é o que permite criar uma nota
 * sem rede (ver docs/plans/03-sync-offline.md). Roda igual no cliente e no servidor.
 */
export function newId(): string {
  return uuidv7()
}
