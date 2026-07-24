/**
 * Geração de IDs no cliente.
 *
 * Toda entidade tem seu ID criado aqui, nunca pelo banco — é o que torna possível
 * criar uma nota sem rede (ver docs/plans/03-sync-offline.md).
 *
 * Fase 2 troca a implementação por UUID v7 (pacote `uuidv7`), que é ordenável por
 * tempo e mantém as inserções sequenciais no índice. Como todo mundo importa daqui,
 * essa troca mexe só neste arquivo.
 */
export function newId(): string {
  return crypto.randomUUID()
}
